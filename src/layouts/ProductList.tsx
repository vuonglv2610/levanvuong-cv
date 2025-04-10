import React from 'react';
import { toast } from "react-toastify";

const ProductList = () => {
    const data = [
        {
            url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg",
            name: "Earthen Bottle",
            price: 48,
            new_price: 36,
            href: "#"
        },
        {
            url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg",
            name: "Focus Paper Refill",
            price: 48,
            new_price: 36,
            href: "#"
        },
        {
            url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg",
            name: "Nomad Tumbler",
            price: 48,
            new_price: 36,
            href: "#"
        },
        {
            url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg",
            name: "Machined Mechanical Pencil",
            price: 48,
            new_price: 36,
            href: "#"
        },
        {
            url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg",
            name: "Machined Mechanical Pencil",
            price: 48,
            new_price: 36,
            href: "#"
        },
        {
            url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg",
            name: "Machined Mechanical Pencil",
            price: 48,
            new_price: 36,
            href: "#"
        },
        {
            url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg",
            name: "Machined Mechanical Pencil",
            price: 48,
            new_price: 36,
            href: "#"
        },
        {
            url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg",
            name: "Machined Mechanical Pencil",
            price: 48,
            new_price: 36,
            href: "#"
        },
        {
            url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg",
            name: "Machined Mechanical Pencil",
            price: 48,
            new_price: 36,
            href: "#"
        },
    ]

    const handleAddToCart = (e: any) => {
        e.preventDefault();
        toast.success("add to cart success!")
    }
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Products</h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {
                        data.map((item, index) => {
                            return <div key={index}>
                                <a href={item.href} className="group">
                                    <img src={item.url} />
                                    <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
                                    <p className="mt-1 text-lg text-gray-900">${item.price}</p>
                                    <p className="mt-1 text-xl font-medium text-gray-900">${item.price}</p>
                                    <button onClick={(e) => handleAddToCart(e)}>Add to cart</button>
                                </a >
                            </div>
                        })
                    }
                </div>
            </div>
        </div >

    )
}

export default ProductList
