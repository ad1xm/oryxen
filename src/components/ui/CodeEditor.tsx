"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const codeSnippets = [
    {
        text: `export const oryxen = defineSystem({
  products: ["web", "mobile", "platform"],
  stack: ["react", "next", "electron"],
  scale: "global",
});`,
        language: "typescript",
    },
    {
        text: `deploy(oryxen, {
  environment: "production",
  region: "global",
  status: "ready",
});`,
        language: "typescript",
    },
];

export default function CodeEditor() {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blinking cursor
    useEffect(() => {
        const timeout2 = setInterval(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearInterval(timeout2);
    }, []);

    // Typing logic
    useEffect(() => {
        if (subIndex === codeSnippets[index].text.length + 1 && !reverse) {
            setTimeout(() => setReverse(true), 4000); // Longer pause (4s)
            return;
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % codeSnippets.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 20 : 40); // Smooth typing speed

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse]);

    const currentText = codeSnippets[index].text.substring(0, subIndex);

    // Improved Syntax Highlighting
    const highlight = (code: string) => {
        return code.split(/(\s+|[(){}[\]=,;"])/g).map((token, i) => {
            if (token.startsWith('"') || token.endsWith('"')) {
                return <span key={i} className="text-emerald-400">{token}</span>;
            }
            if (['export', 'const', 'return', 'function', '=>', 'import'].includes(token)) {
                return <span key={i} className="text-purple-400">{token}</span>;
            }
            if (['defineSystem', 'deploy'].includes(token)) {
                return <span key={i} className="text-blue-400 font-bold">{token}</span>;
            }
            if (['products', 'stack', 'scale', 'environment', 'region', 'status'].includes(token)) {
                return <span key={i} className="text-cyan-300">{token}</span>; // Object keys
            }
            if (['oryxen'].includes(token)) {
                return <span key={i} className="text-yellow-300">{token}</span>; // Variable
            }
            return <span key={i} className="text-zinc-100">{token}</span>;
        });
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-[#09090b] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl h-[320px] flex flex-col">
            {/* Window Header */}
            <div className="flex items-center px-4 py-3 bg-zinc-900 border-b border-zinc-800 gap-2 shrink-0 h-[45px]">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                <div className="ml-auto text-xs font-mono text-zinc-600">build.ts</div>
            </div>

            {/* Editor Content */}
            <div className="p-6 font-mono text-sm sm:text-base leading-relaxed grow w-full overflow-hidden flex items-start">
                <div className="whitespace-pre-wrap w-full">
                    {highlight(currentText)}
                    <motion.span
                        animate={{ opacity: blink ? 1 : 0 }}
                        className="inline-block w-[2px] h-5 bg-cyan-400 ml-1 align-middle"
                    />
                </div>
            </div>
        </div>
    );
}
