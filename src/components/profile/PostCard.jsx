"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Trash2, Check, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PostCard({ post, onDelete }) {
    const { t, language } = useLanguage();
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Card className="h-full flex flex-col rounded-[2.5rem] overflow-hidden border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] bg-white dark:bg-[#0f0f0f] group hover:-translate-y-2 transition-all duration-500 relative">
                <div className="relative aspect-[4/3] overflow-hidden p-2">
                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                        <img
                            src={
                                post.image_url ||
                                "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=1000"
                            }
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-[#3b60ff] hover:bg-[#3b60ff] text-white border-none px-4 py-2 font-black uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] tracking-widest rounded-full shadow-lg">
                                {t("blog.storyTag")}
                            </Badge>
                        </div>

                        {/* Delete Button Toggle */}
                        {onDelete && !showConfirm && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowConfirm(true);
                                }}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-red-500 backdrop-blur-md flex items-center justify-center transition-colors shadow-lg group/delete z-20"
                            >
                                <Trash2 size={14} className="text-white group-hover/delete:text-white" />
                            </button>
                        )}

                        {/* Confirmation Overlay */}
                        <AnimatePresence>
                            {showConfirm && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-red-600/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white p-4"
                                >
                                    <p className="font-black uppercase italic tracking-widest text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] mb-4 text-center leading-tight">
                                        {t("profile.post.deleteConfirm") || "LÖSCHEN?"}
                                    </p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setShowConfirm(false);
                                            }}
                                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onDelete(post.id);
                                            }}
                                            className="w-10 h-10 rounded-full bg-white hover:bg-zinc-100 text-red-600 flex items-center justify-center transition-colors shadow-lg"
                                        >
                                            <Check size={20} strokeWidth={3} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <CardHeader className="pt-4 px-8 flex-grow space-y-4 text-left">
                    <div className="flex items-center gap-2 text-zinc-400 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] uppercase font-bold tracking-widest">
                        <Calendar size={12} />
                        {new Date(post.created_at).toLocaleDateString(language === "de" ? "de-DE" : "en-US")}
                    </div>
                    <CardTitle className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl md:text-3xl font-[1000] italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
                        {post.title}
                    </CardTitle>
                    <p className="text-zinc-500 dark:text-zinc-400 line-clamp-3 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm leading-relaxed font-medium">
                        {post.content}
                    </p>
                </CardHeader>

                <CardFooter className="p-8 pt-0 mt-auto">
                    <Button
                        asChild
                        className="w-full h-10 sm:h-12 md:h-14 bg-[#3b60ff] hover:bg-[#2f4ccc] text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/20 group/btn border-none text-[9px] sm:text-xs"
                    >
                        <Link
                            href={`/blog/${post.id}`}
                            className="flex items-center justify-center gap-2"
                        >
                            {t("blog.readMore")}{" "}
                            <ArrowRight
                                size={16}
                                className="group-hover/btn:translate-x-1 transition-transform"
                                strokeWidth={3}
                            />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}