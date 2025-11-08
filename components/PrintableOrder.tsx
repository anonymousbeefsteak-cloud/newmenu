import React from 'react';
import type { Order, CartItem, OrderData } from '../types';

type PrintableOrderProps = {
    order: Order | OrderData | null;
    orderId?: string | null;
};

// 合併相同品項的函數
const mergeSameItems = (items: CartItem[]): CartItem[] => {
    const mergedMap = new Map();
    
    items.forEach(item => {
        const key = `${item.item.name}-${JSON.stringify(item.selectedDonenesses)}-${JSON.stringify(item.selectedComponent)}-${JSON.stringify(item.selectedSideChoices)}-${JSON.stringify(item.selectedMultiChoice)}-${JSON.stringify(item.selectedDrinks)}-${JSON.stringify(item.selectedSauces)}-${JSON.stringify(item.selectedDesserts)}-${JSON.stringify(item.selectedPastas)}-${item.selectedSingleChoiceAddon}-${JSON.stringify(item.selectedAddons)}-${item.selectedNotes}`;
        
        if (mergedMap.has(key)) {
            const existing = mergedMap.get(key);
            existing.quantity += item.quantity;
            existing.totalPrice = (parseFloat(existing.totalPrice) + parseFloat(item.totalPrice)).toString();
        } else {
            mergedMap.set(key, { ...item });
        }
    });
    
    return Array.from(mergedMap.values());
};

// 簡化的品項渲染
const renderPrintableItem = (item: CartItem, index: number, totalItems: number) => {
    const details = [
        item.selectedDonenesses && Object.keys(item.selectedDonenesses).length > 0 && `熟度: ${Object.entries(item.selectedDonenesses).map(([d, q]) => `${d}x${q}`).join(', ')}`,
        item.selectedComponent && Object.keys(item.selectedComponent).length > 0 && `炸物: ${Object.entries(item.selectedComponent).map(([c, q]) => `${c}x${q}`).join(', ')}`,
        item.selectedSideChoices && Object.keys(item.selectedSideChoices).length > 0 && `簡餐: ${Object.entries(item.selectedSideChoices).map(([d, q]) => `${d}x${q}`).join(', ')}`,
        item.selectedMultiChoice && Object.keys(item.selectedMultiChoice).length > 0 && `口味: ${Object.entries(item.selectedMultiChoice).map(([d, q]) => `${d}x${q}`).join(', ')}`,
        item.selectedDrinks && Object.keys(item.selectedDrinks).length > 0 && `飲料: ${Object.entries(item.selectedDrinks).map(([d, q]) => `${d}x${q}`).join(', ')}`,
        item.selectedSauces && item.selectedSauces.length > 0 && `醬料: ${item.selectedSauces.map(s => `${s.name}x${s.quantity}`).join(', ')}`,
        item.selectedDesserts && item.selectedDesserts.length > 0 && `甜品: ${item.selectedDesserts.map(d => `${d.name}x${d.quantity}`).join(', ')}`,
        item.selectedPastas && item.selectedPastas.length > 0 && `義麵: ${item.selectedPastas.map(p => `${p.name}x${p.quantity}`).join(', ')}`,
        item.selectedSingleChoiceAddon && `單點加購: ${item.selectedSingleChoiceAddon}`,
        item.selectedAddons && item.selectedAddons.length > 0 && `加購: ${item.selectedAddons.map(a => `${a.name} x${a.quantity}`).join(', ')}`,
        item.selectedNotes && `備註: ${item.selectedNotes}`,
    ].filter(Boolean);

    return (
        <React.Fragment key={item.cartId}>
            <tr className="border-b border-gray-800">
                <td className="align-top pr-3 font-black text-5xl py-1" style={{ width: '15%' }}>
                    {item.quantity}x
                </td>
                <td className="align-top py-1" style={{ width: '65%' }}>
                    <span className="font-black text-5xl block leading-tight">
                        {item.item.name.replace(/半全餐|半套餐/g, '套餐')}
                    </span>
                    {details.length > 0 && (
                        <div className="text-4xl font-bold pl-2 mt-1">
                            {details.map((detail, i) => (
                                <div key={i} className="leading-tight break-words">• {detail}</div>
                            ))}
                        </div>
                    )}
                </td>
                <td className="align-top pl-3 text-right font-black text-5xl py-1" style={{ width: '20%' }}>
                    {item.totalPrice}
                </td>
            </tr>
            {/* 最後一項不加分隔線 */}
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
    
    // 合併相同品項
    const mergedItems = mergeSameItems(order.items);
    
    return (
        <div className="p-4 bg-white text-5xl text-black" style={{ width: '350px', margin: '0 auto', lineHeight: '1.2' }}>
            <div className="text-center space-y-2 mb-4">
                <h3 className="text-6xl font-black leading-tight">無名牛排</h3>
                <p className="text-5xl font-black leading-tight">廚房工作單</p>
                <p className="text-4xl">────────────────</p>
            </div>
            
            <div className="space-y-2 my-4 font-black text-4xl">
                {finalOrderId && (
                    <p className="leading-tight">
                        <span className="font-black">單號:</span> {finalOrderId}
                    </p>
                )}
                <p className="leading-tight">
                    <span className="font-black">時間:</span> {createdAt}
                </p>
                <p className="leading-tight">
                    <span className="font-black">顧客:</span> {order.customerInfo.name} ({order.customerInfo.phone})
                </p>
                <p className="leading-tight">
                    <span className="font-black">類型:</span> {order.orderType} 
                    {order.orderType === '內用' && order.customerInfo.tableNumber ? ` (${order.customerInfo.tableNumber}桌)` : ''}
                </p>
            </div>
            
            <p className="text-center text-4xl my-2">────────────────</p>
            
            <table className="w-full my-1 text-4xl" style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                <thead>
                    <tr className="border-b-2 border-gray-800">
                        <th className="font-black text-left pb-1" style={{ width: '15%' }}>數量</th>
                        <th className="font-black text-left pb-1" style={{ width: '65%' }}>品項</th>
                        <th className="font-black text-right pb-1" style={{ width: '20%' }}>小計</th>
                    </tr>
                </thead>
                <tbody>
                    {mergedItems.map((item, index) => 
                        renderPrintableItem(item, index, mergedItems.length)
                    )}
                </tbody>
            </table>
            
            <p className="text-center text-4xl my-2">────────────────</p>
            
            <div className="text-right mt-2">
                <p className="text-6xl font-black leading-tight">總計: ${order.totalPrice}</p>
            </div>
            
            <div className="text-center mt-4">
                <p className="text-4xl font-bold">感謝您的訂購！</p>
            </div>
        </div>
    );
};
