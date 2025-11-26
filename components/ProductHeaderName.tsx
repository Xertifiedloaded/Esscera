"use client";

import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import React, { useState, useEffect } from "react";

interface Product {
    id: number;
    name: string;
    description: string;
    available: boolean;
}

export default function ProductHeaderClient({ products }: { products: Product[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [fade, setFade] = useState(true);
    const { addToCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (!products || products.length === 0) return;

        const interval = setInterval(() => {
            setFade(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % products.length);
                setFade(true);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, [products?.length]);


    if (!products || products.length === 0) {
        return (
            <div className="p-8 min-h-screen flex flex-col justify-center items-start">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-white drop-shadow-2xl">
                    Welcome to{" "}
                    <span className="font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-purple-300 to-amber-400">
                        Esscera
                    </span>
                </h1>

                <p className="text-gray-300 text-lg mt-4 max-w-lg leading-relaxed">
                    Discover luxury crafted with intention. Our store updates often—check back soon for new arrivals.
                </p>
            </div>
        );
    }

    const currentProduct = products[currentIndex];

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentProduct.available) return;

        if (!user) {
            toast({
                title: "Please login",
                description: "You need to be logged in to add items to your cart.",
                variant: "destructive",
            });
            router.push("/login");
            return;
        }

        setIsAdding(true);
        try {
            await addToCart(currentProduct.id);
            toast({
                title: "Added to cart",
                description: `${currentProduct.name} has been added to your cart.`,
            });
        } catch {
            toast({
                title: "Error",
                description: "Failed to add item to cart.",
                variant: "destructive",
            });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="w-full">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400 text-sm tracking-[0.3em] uppercase mb-4 block font-light">
                New Collection
            </span>

            <div className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
                <h1 className=" font-light leading-[1.1] mb-6 text-white drop-shadow-2xl">
                    <span className=" text-6xl  lg:text-8xl  md:text-7xl  font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-purple-300 to-amber-400">        {currentProduct.name}</span>
                    <br />
                    <span className="font-semibold text-3xl lg:text-6xl ">
                        By Esscera
                    </span>
                </h1>
                <p className="text-sm md:text-lg text-gray-200 mb-10 max-w-md leading-relaxed drop-shadow-lg">
                    {currentProduct.description}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding || !currentProduct.available}
                    className="w-full sm:w-auto bg-linear-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-medium tracking-widest uppercase px-6 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAdding ? "Adding..." : "Add to Cart"}
                </button>

                <a href="/products?category=bestsellers" className="w-full sm:w-auto">
                    <button className="w-full border-2 border-purple-400/60 text-white hover:border-amber-400 hover:bg-linear-to-r hover:from-purple-600/30 hover:to-amber-600/30 font-medium tracking-widest uppercase px-6 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm transition-all duration-300 bg-white/10 backdrop-blur-sm rounded-md">
                        View Bestsellers
                    </button>
                </a>
            </div>

            <div className="mt-8 flex gap-2">
                {products.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex
                                ? "w-8 bg-linear-to-r from-purple-400 to-amber-400 shadow-lg shadow-purple-400/50"
                                : "w-4 bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
