import React from 'react';
import type { Order, CartItem, OrderData } from '../types';

type PrintableOrderProps = {
    order: Order | OrderData | null;
    orderId?: string | null;
};

// Simplified and more compact item rendering for receipts
const renderPrintableItem = (item: CartItem) => {
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
    ].filter(Boolean); // Filter out any false/null/undefined values

    return (
        <tr key={item.cartId}>
            <td className="align-top pr-2 font-semibold">{item.quantity}x</td>
            <td className="align-top w-full">
                <span className="font-semibold">{item.item.name.replace(/半全餐|半套餐/g, '套餐')}</span>
                {details.length > 0 && (
                    <div className="text-sm font-normal pl-2">
                        {details.map((detail, i) => <div key={i}>- {detail}</div>)}
                    </div>
                )}
            </td>
            <td className="align-top pl-2 text-right font-semibold">{item.totalPrice}</td>
        </tr>
    );
};


export const PrintableOrder: React.FC<PrintableOrderProps> = ({ order, orderId }) => {
    if (!order) {
        return null;
    }
    
    const finalOrderId = 'id' in order ? order.id : orderId;
    const createdAt = 'createdAt' in order && order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString();
    
    return (
        // This container's styles are mostly for on-screen preview. 
        // Print styles in index.html will override for the actual printout.
        <div className="p-2 bg-white text-sm text-black" style={{ width: '280px', margin: '0 auto' }}>
            <div className="text-center space-y-1">
                <h3 className="text-lg font-bold">無名牛排</h3>
                <p className="font-semibold">廚房工作單</p>
                <p>--------------------------------</p>
            </div>
            <div className="space-y-0.5 my-2">
                {finalOrderId && <p><strong>單號:</strong> {finalOrderId}</p>}
                <p><strong>時間:</strong> {createdAt}</p>
                <p><strong>顧客:</strong> {order.customerInfo.name} ({order.customerInfo.phone})</p>
                <p><strong>類型:</strong> {order.orderType} {order.orderType === '內用' && order.customerInfo.tableNumber ? `(${order.customerInfo.tableNumber}桌)` : ''}</p>
            </div>
            <p className="text-center">--------------------------------</p>
            <table className="w-full my-1 text-sm">
                <thead>
                    <tr>
                        <th className="font-bold text-left">數</th>
                        <th className="font-bold text-left">品項</th>
                        <th className="font-bold text-right">小計</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map(renderPrintableItem)}
                </tbody>
            </table>
            <p className="text-center">--------------------------------</p>
            <div className="text-right">
                <p className="text-lg font-bold">總計: ${order.totalPrice}</p>
            </div>
            <div className="text-center mt-4">
                <p className="text-xs">感謝您的訂購！</p>
            </div>
        </div>
    );
};
