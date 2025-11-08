import React from 'react';
import type { Order, CartItem, OrderData } from '../types';

type PrintableOrderProps = {
    order: Order | OrderData | null;
    orderId?: string | null;
};

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
    ].filter(Boolean);

    return (
        <tr key={item.cartId}>
            <td className="align-top pr-3 font-black text-4xl" style={{ width: '15%' }}>
                {item.quantity}x
            </td>
            <td className="align-top" style={{ width: '65%' }}>
                <span className="font-black text-4xl block leading-tight">
                    {item.item.name.replace(/半全餐|半套餐/g, '套餐')}
                </span>
                {details.length > 0 && (
                    <div className="text-3xl font-bold pl-2 mt-1">
                        {details.map((detail, i) => (
                            <div key={i} className="leading-tight break-words">• {detail}</div>
                        ))}
                    </div>
                )}
            </td>
            <td className="align-top pl-3 text-right font-black text-4xl" style={{ width: '20%' }}>
                {item.totalPrice}
            </td>
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
        // 橫向布局：寬度大於高度，使用橫向樣式
        <div 
            className="p-4 bg-white text-4xl text-black landscape-print"
            style={{ 
                width: '800px',  // 橫向寬度
                height: '280px', // 橫向高度
                margin: '0 auto',
                lineHeight: '1.2',
                transform: 'rotate(0deg)' // 確保不旋轉
            }}
        >
            {/* 橫向專用 CSS */}
            <style>
                {`
                    @media print {
                        @page {
                            size: landscape;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }
                `}
            </style>
            
            <div className="flex h-full">
                {/* 左側：訂單資訊 */}
                <div className="w-1/3 pr-4 border-r-2 border-gray-400">
                    <div className="text-center space-y-2 mb-4">
                        <h3 className="text-5xl font-black leading-tight">無名牛排</h3>
                        <p className="text-4xl font-black leading-tight">廚房工作單</p>
                        <p className="text-3xl">────────────</p>
                    </div>
                    
                    <div className="space-y-2 font-black text-3xl">
                        {finalOrderId && (
                            <p className="leading-tight">
                                <span className="font-black">單號:</span><br/>{finalOrderId}
                            </p>
                        )}
                        <p className="leading-tight">
                            <span className="font-black">時間:</span><br/>{createdAt}
                        </p>
                        <p className="leading-tight">
                            <span className="font-black">顧客:</span><br/>{order.customerInfo.name}<br/>({order.customerInfo.phone})
                        </p>
                        <p className="leading-tight">
                            <span className="font-black">類型:</span><br/>{order.orderType} 
                            {order.orderType === '內用' && order.customerInfo.tableNumber ? ` (${order.customerInfo.tableNumber}桌)` : ''}
                        </p>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <p className="text-4xl font-black">總計: ${order.totalPrice}</p>
                    </div>
                </div>
                
                {/* 右側：品項列表 */}
                <div className="w-2/3 pl-4">
                    <table className="w-full text-3xl" style={{ tableLayout: 'fixed' }}>
                        <thead>
                            <tr>
                                <th className="font-black text-left pb-2" style={{ width: '15%' }}>數量</th>
                                <th className="font-black text-left pb-2" style={{ width: '65%' }}>品項</th>
                                <th className="font-black text-right pb-2" style={{ width: '20%' }}>小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(renderPrintableItem)}
                        </tbody>
                    </table>
                    
                    <div className="text-center mt-4">
                        <p className="text-3xl font-bold">感謝您的訂購！</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
