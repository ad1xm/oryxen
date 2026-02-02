"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Globe, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllSlotsForDate, bookSlot, createAndBookSlot, ConsultationSlot } from "@/lib/supabase";

// Generate time slots (7:30 PM - 1 AM IST)
const timeSlots = [
    // Early morning slots (next day technically, but part of the night shift)
    "00:00", "00:30", "01:00",
    // Evening slots
    "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface ConsultationSchedulerProps {
    onBack: () => void;
}

export default function ConsultationScheduler({ onBack }: ConsultationSchedulerProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [step, setStep] = useState<"date" | "time" | "confirm" | "success">("date");
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<ConsultationSlot[]>([]);
    const [timezone, setTimezone] = useState(() => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
            return "UTC";
        }
    });

    // Calendar logic
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const isDateSelectable = (day: number) => {
        const date = new Date(year, month, day);
        return date >= today && date.getDay() !== 0 && date.getDay() !== 6;
    };

    const handleDateSelect = async (day: number) => {
        if (isDateSelectable(day)) {
            const date = new Date(year, month, day);
            setSelectedDate(date);
            setSelectedTime(null);

            // Fetch slots for this date
            setIsLoadingSlots(true);
            try {
                // Fix: Use local date format to avoid timezone issues
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;

                const slots = await getAllSlotsForDate(dateString);
                setBookedSlots(slots);
            } catch (error) {
                console.error('Error fetching slots:', error);
                setBookedSlots([]);
            } finally {
                setIsLoadingSlots(false);
            }

            setStep("time");
        }
    };

    /**
     * Get the status of a time slot - SINGLE SOURCE OF TRUTH
     * Returns color, clickability, and label based on database state
     */
    const getSlotStatus = (time: string) => {
        const dbSlot = bookedSlots.find(s => s.time === time);

        // If slot exists in database AND is booked (is_available = false)
        if (dbSlot && !dbSlot.is_available) {
            return {
                isAvailable: false,
                isBooked: true,
                color: 'red',
                label: 'Booked'
            };
        }

        // Otherwise, slot is available (either doesn't exist or is_available = true)
        return {
            isAvailable: true,
            isBooked: false,
            color: 'green',
            label: null
        };
    };

    const handleTimeSelect = (time: string) => {
        const status = getSlotStatus(time);
        if (status.isAvailable) {
            setSelectedTime(time);
            setStep("confirm");
        }
    };

    const formatSelectedDate = () => {
        if (!selectedDate) return "";
        return selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime || !formData.name || !formData.email || !formData.phone) return;

        setIsSubmitting(true);

        try {
            // Find the slot for this date/time
            // Fix: Use local date format to avoid timezone issues
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            const slot = bookedSlots.find(s => s.time === selectedTime);

            if (slot && slot.is_available) {
                // Book existing available slot
                await bookSlot(slot.id, formData.name, formData.email);
            } else if (!slot) {
                // Slot doesn't exist in database yet - create it and book it
                await createAndBookSlot(dateString, selectedTime, formData.name, formData.email);
            } else {
                // Slot was already booked (race condition)
                alert("This slot was just booked by someone else. Please select another time.");
                setIsSubmitting(false);
                // Refresh slots
                const slots = await getAllSlotsForDate(dateString);
                setBookedSlots(slots);
                setStep("time");
                return;
            }

            // Send notification to admin via Formspree
            const response = await fetch("https://formspree.io/f/mandwdda", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "Consultation Booking",
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    date: formatSelectedDate(),
                    time: selectedTime,
                    timezone: timezone,
                    notes: formData.notes || "No additional notes"
                })
            });

            if (response.ok) {
                // Send confirmation email via Resend
                await fetch("/api/send-confirmation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        name: formData.name,
                        type: "consultation"
                    })
                });

                // Refresh slots to show updated availability
                const updatedSlots = await getAllSlotsForDate(dateString);
                setBookedSlots(updatedSlots);

                setStep("success");
            } else {
                alert("Failed to send notification. Your booking is saved but we may need to confirm manually.");

                // Still refresh slots even if notification failed
                const updatedSlots = await getAllSlotsForDate(dateString);
                setBookedSlots(updatedSlots);

                setStep("success");
            }
        } catch (error) {
            console.error('Booking error:', error);
            // Show more detailed error to help debug
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to book consultation: ${errorMessage}\n\nPlease try again or contact support.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <button
                    onClick={step === "date" ? onBack : () => setStep(step === "time" ? "date" : step === "confirm" ? "time" : "date")}
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    {step === "date" ? "Back" : "Previous Step"}
                </button>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Globe className="w-3 h-3" />
                    <span>{timezone}</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* Date Selection */}
                {step === "date" && (
                    <motion.div
                        key="date"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-cyan-500" />
                            Select a Date
                        </h3>

                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={prevMonth} className="p-2 text-zinc-400 hover:text-white transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-white font-medium">{months[month]} {year}</span>
                            <button onClick={nextMonth} className="p-2 text-zinc-400 hover:text-white transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {days.map(day => (
                                <div key={day} className="text-center text-xs text-zinc-500 py-2">{day}</div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, i) => (
                                <div key={i} className="aspect-square">
                                    {day && (
                                        <button
                                            onClick={() => handleDateSelect(day)}
                                            disabled={!isDateSelectable(day)}
                                            className={`w-full h-full rounded-lg text-sm transition-all ${selectedDate?.getDate() === day && selectedDate?.getMonth() === month
                                                ? "bg-cyan-500 text-black font-bold"
                                                : isDateSelectable(day)
                                                    ? "text-white hover:bg-zinc-800"
                                                    : "text-zinc-700 cursor-not-allowed"
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Time Selection */}
                {step === "time" && (
                    <motion.div
                        key="time"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                            <Clock className="w-5 h-5 text-cyan-500" />
                            Select a Time
                        </h3>
                        <p className="text-zinc-500 text-sm mb-6">{formatSelectedDate()}</p>

                        {/* Clock Visual */}
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full border-2 border-zinc-700" />
                            <div className="absolute inset-2 rounded-full border border-zinc-800" />
                            {selectedTime && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="text-2xl font-bold text-cyan-400">{selectedTime}</div>
                                </motion.div>
                            )}
                            {!selectedTime && (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-sm">
                                    {isLoadingSlots ? "Loading..." : "Pick time"}
                                </div>
                            )}
                        </div>

                        {/* Time Slots Grid */}
                        {isLoadingSlots ? (
                            <div className="text-center text-zinc-500 py-8">Loading available slots...</div>
                        ) : (
                            <div className="grid grid-cols-4 gap-2">
                                {timeSlots.map(time => {
                                    const status = getSlotStatus(time);
                                    const isSelected = selectedTime === time;

                                    return (
                                        <button
                                            key={time}
                                            onClick={() => handleTimeSelect(time)}
                                            disabled={!status.isAvailable}
                                            className={`py-3 rounded-lg text-sm font-medium transition-all ${isSelected
                                                ? "bg-cyan-500 text-black ring-2 ring-cyan-400"
                                                : status.color === 'green'
                                                    ? "bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 hover:border-green-400"
                                                    : "bg-red-500/20 text-red-400 border border-red-500/50 cursor-not-allowed opacity-70"
                                                }`}
                                        >
                                            {time}
                                            {status.label && <span className="block text-xs mt-0.5">{status.label}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Confirm Booking */}
                {step === "confirm" && (
                    <motion.div
                        key="confirm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6">Confirm Your Booking</h3>

                        {/* Summary */}
                        <div className="bg-zinc-800/50 rounded-lg p-4 mb-6 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Date</span>
                                <span className="text-white">{formatSelectedDate()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Time</span>
                                <span className="text-white">{selectedTime}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Timezone</span>
                                <span className="text-white">{timezone}</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">Name *</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">Email *</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="you@company.com"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">Phone Number *</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-400 block mb-2">Notes (optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                                    rows={3}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                                    placeholder="Brief project description..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white text-black py-4 rounded-lg font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Booking..." : "Confirm Booking"}
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Success */}
                {step === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-12 text-center"
                    >
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Consultation Booked</h3>
                        <p className="text-zinc-400 mb-2">{formatSelectedDate()} at {selectedTime}</p>
                        <p className="text-zinc-500 text-sm mb-8">You'll receive a confirmation email shortly.</p>
                        <button
                            onClick={onBack}
                            className="text-sm text-zinc-500 underline hover:text-white transition-colors"
                        >
                            Back to Contact
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
