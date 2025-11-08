import React from 'react';
import type { Order, CartItem, OrderData } from '../types';

type PrintableOrderProps = {
    order: Order | OrderData | null;
    orderId?: string | null;
};

// 只合併相同品項名稱，不考慮其他選項
const mergeItemsByProductName = (items: CartItem[]): CartItem[] => {
    const mergedMap = new Map();
    
    items.forEach(item => {
        const productName = item.item.name.replace(/半全餐|半套餐/g, '套餐');
        const key = productName; // 只根據品項名稱合併
        
        if (mergedMap.has(key)) {
            const existing = mergedMap.get(key);
            existing.quantity += item.quantity;
            existing.totalPrice = (parseFloat(existing.totalPrice) + parseFloat(item.totalPrice)).toString();
        } else {
            mergedMap.set(key, { 
                ...item,
                item: {
                    ...item.item,
                    name: productName
                }
            });
        }
    });
    
    return Array.from(mergedMap.values());
};

// 極簡化的品項渲染 - 只顯示名稱和合併數量
const renderPrintableItem = (item: CartItem, index: number, totalItems: number) => {
    return (
        <React.Fragment key={item.cartId || index}>
            <tr className="border-b border-gray-800">
                <td className="pr-2 font-black text-5xl py-0 text-center" style={{ width: '20%' }}>
                    {item.quantity}x
                </td>
                <td className="py-0" style={{ width: '60%' }}>
                    <span className="font-black text-5xl block leading-tight whitespace-nowrap">
                        {item.item.name}
                    </span>
                </td>
                <td className="pl-2 text-right font-black text-5xl py-0" style={{ width: '20%' }}>
                    {item.totalPrice}
                </td>
            </tr>
            {/* 品項間的分隔線 */}
            {index < totalItems - 1 && (
                <tr>
                    <td colSpan={3} className="py-0">
                        <div className="border-t border-dashed border-gray-600"></div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};

export const PrintableOrder: React.FC<PrintableOrderProps> = ({ order, orderId }) => {
    if (!order) {
        return null;
    }
    
    const finalOrderId = 'id' in order ? order.id : orderId;
    const createdAt = 'createdAt' in order && order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString();
    
    // 合併相同品項（只根據名稱）
    const mergedItems = mergeItemsByProductName(order.items);
    
    return (
        <div className="p-3 bg-white text-black" style={{ width: '350px', margin: '0 auto', lineHeight: '1.1' }}>
            {/* 標題區塊 */}
            <div className="text-center mb-2">
                <h3 className="font-black text-4xl mb-0">無名牛排</h3>
                <p className="font-black text-3xl mb-1">廚房工作單</p>
                <div className="border-t border-black my-1"></div>
            </div>
            
            {/* 訂單資訊 */}
            <div className="space-y-0 mb-2 font-bold text-2xl">
                {finalOrderId && (
                    <p className="leading-tight">
                        <span>單號:</span> {finalOrderId}
                    </p>
                )}
                <p className="leading-tight">
                    <span>時間:</span> {createdAt}
                </p>
                <p className="leading-tight">
                    <span>顧客:</span> {order.customerInfo.name} ({order.customerInfo.phone})
                </p>
                <p className="leading-tight">
                    <span>類型:</span> {order.orderType} 
                    {order.orderType === '內用' && order.customerInfo.tableNumber ? ` (${order.customerInfo.tableNumber}桌)` : ''}
                </p>
            </div>
            
            <div className="border-t border-black my-1"></div>
            
            {/* 品項表格 - 只顯示合併數量 */}
            <table className="w-full my-0" style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="font-black text-center pb-1 text-3xl" style={{ width: '20%' }}>數量</th>
                        <th className="font-black text-left pb-1 text-3xl" style={{ width: '60%' }}>品項</th>
                        <th className="font-black text-right pb-1 text-3xl" style={{ width: '20%' }}>小計</th>
                    </tr>
                </thead>
                <tbody>
                    {mergedItems.map((item, index) => 
                        renderPrintableItem(item, index, mergedItems.length)
                    )}
                </tbody>
            </table>
            
            <div className="border-t border-black my-1"></div>
            
            {/* 總計 */}
            <div className="text-right mt-1">
                <p className="text-4xl font-black">總計: ${order.totalPrice}</p>
            </div>
            
            {/* 頁尾 */}
            <div className="text-center mt-2">
                <p className="text-2xl font-bold">感謝您的訂購！</p>
            </div>
        </div>
    );
};
