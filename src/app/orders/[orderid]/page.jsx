"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailPage() {
  const { orderid } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderid) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderid}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderid]);

  if (loading) {
    return <div className="container mx-auto px-4 py-10">Loading...</div>;
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-red-600">{error}</div>
    );
  }
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-10">Order not found.</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Order #{order.orderNumber}</h1>
      <div className="mb-4 text-gray-600">
        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Status:</span> {order.orderStatus}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Shipping Address:</span> {order.shippingAddress}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Total Amount:</span> ₹{order.totalAmount.toLocaleString()}
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-2">Items</h2>
      <div className="space-y-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 border-b pb-2">
            <div className="relative w-16 h-20 rounded overflow-hidden">
              <Image
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.size} × {item.quantity}
              </p>
              <p className="text-sm">₹{item.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <Link href="/orders" className="inline-block mt-8 text-pink-600 hover:underline">
        ← Back to Orders
      </Link>
    </div>
  );
}
