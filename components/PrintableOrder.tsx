import React, { useMemo } from 'react';
import type { Order, OrderData, CartItem, SelectedSauce } from '../types';

type PrintableOrderProps = {
    order: Order | OrderData | null;
    orderId?: string | null;
};

export const PrintableOrder: React.FC<PrintableOrderProps> = ({ order, orderId }) => {
    if (!order) {
        return null;
    }

    // Merge items with the same configuration
    const mergedItems = useMemo(() => {
        if (!order?.items) return [];

        const itemMap = new Map<string, CartItem>();
        order.items.forEach(cartItem => {
            // The cartKey uniquely identifies an item with all its customizations
            const key = cartItem.cartKey;
            const existing = itemMap.get(key);
            
            if (existing) {
                const newQuantity = existing.quantity + cartItem.quantity;
                // Recalculate total price for the merged item
                const singleChoicePrice = existing.selectedSingleChoiceAddon && existing.item.customizations.singleChoiceAddon ? existing.item.customizations.singleChoiceAddon.price : 0;
                const totalAddonPrice = (existing.selectedAddons || []).reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
                const newTotalPrice = (existing.item.price + singleChoicePrice) * newQuantity + totalAddonPrice;
                
                itemMap.set(key, {
                    ...existing,
                    quantity: newQuantity,
                    totalPrice: newTotalPrice,
                });
            } else {
                itemMap.set(key, { ...cartItem });
            }
        });
        return Array.from(itemMap.values());
    }, [order?.items]);

    // Calculate the total summary of all options
    const summary = useMemo(() => {
        if (!order?.items) return {};
        const sauces: { [key: string]: number } = {};
        const drinks: { [key: string]: number } = {};
        const desserts: { [key: string]: number } = {};
        const pastas: { [key: string]: number } = {};
        const components: { [key: string]: number } = {};
        const sideChoices: { [key: string]: number } = {};
        const addons: { [key: string]: number } = {};

        order.items.forEach(cartItem => {
            if (cartItem.selectedDrinks) Object.entries(cartItem.selectedDrinks).forEach(([name, quantity]) => drinks[name] = (drinks[name] || 0) + Number(quantity));
            if (cartItem.selectedSauces) (cartItem.selectedSauces as SelectedSauce[]).forEach(sauce => sauces[sauce.name] = (sauces[sauce.name] || 0) + Number(sauce.quantity));
            if (cartItem.selectedDesserts) cartItem.selectedDesserts.forEach(dessert => desserts[dessert.name] = (desserts[dessert.name] || 0) + Number(dessert.quantity));
            if (cartItem.selectedPastas) cartItem.selectedPastas.forEach(pasta => pastas[pasta.name] = (pastas[pasta.name] || 0) + Number(pasta.quantity));
            if (cartItem.selectedComponent) Object.entries(cartItem.selectedComponent).forEach(([name, quantity]) => components[name] = (components[name] || 0) + Number(quantity));
            if (cartItem.selectedSideChoices) Object.entries(cartItem.selectedSideChoices).forEach(([name, quantity]) => sideChoices[name] = (sideChoices[name] || 0) + Number(quantity));
            if (cartItem.selectedAddons) cartItem.selectedAddons.forEach(addon => addons[addon.name] = (addons[addon.name] || 0) + Number(addon.quantity));
        });
        
        const result: { [key: string]: { [key: string]: number } } = { components, drinks, sideChoices, sauces, desserts, pastas, addons };
        // Clean up empty categories from the result
        Object.keys(result).forEach(key => {
            if (Object.keys(result[key]).length === 0) {
                delete result[key];
            }
        });
        return result;
    }, [order?.items]);

    const summaryTitles: { [key: string]: string } = {
        components: "炸物總計",
        drinks: "飲料總計",
        sideChoices: "簡餐附餐總計",
        sauces: "醬料總計",
        desserts: "甜品總計",
        pastas: "義麵總計",
        addons: "加購總計",
    };
    
    const finalOrderId = 'id' in order ? order.id : orderId;
    const createdAt = 'createdAt' in order && order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString();
    
    const separator = (text: string) => <p className="text-center font-bold" style={{ fontSize: '36px', letterSpacing: '-2px', margin: '8px 0' }}>- {text} -</p>;

    return (
        <div className="p-2 bg-white text-black" style={{ width: '280px', margin: '0 auto', fontFamily: 'monospace' }}>
            <div className="text-center">
                <h3 className="font-bold" style={{ fontSize: '60px', lineHeight: '1.1' }}>無名牛排</h3>
                <p className="font-bold" style={{ fontSize: '44px' }}>廚房工作單</p>
            </div>
            
            {separator("訂單資訊")}
            <div className="my-2 font-semibold" style={{ fontSize: '32px', lineHeight: '1.3' }}>
                {finalOrderId && <p><strong>單號:</strong> {finalOrderId.slice(-6)}</p>}
                <p><strong>時間:</strong> {createdAt}</p>
                <p><strong>顧客:</strong> {order.customerInfo.name}</p>
                <p><strong>類型:</strong> {order.orderType} {order.orderType === '內用' && order.customerInfo.tableNumber ? `(${order.customerInfo.tableNumber}桌)` : ''}</p>
            </div>

            {separator("餐點內容")}
            <div className="my-2 space-y-4">
                {mergedItems.map((item) => (
                    <div key={item.cartKey} className="text-center">
                        <div className="font-bold flex justify-between items-baseline" style={{ fontSize: '36px' }}>
                            <span>數量 x{item.quantity}</span>
                            <span>小計 ${item.totalPrice}</span>
                        </div>
                        <p className="font-bold" style={{ fontSize: '56px', lineHeight: '1.2', borderBottom: '2px dotted black', paddingBottom: '8px' }}>
                            {item.item.name.replace(/半全餐|半套餐/g, '套餐')}
                        </p>
                    </div>
                ))}
            </div>
            
            {Object.keys(summary).length > 0 && (
                <>
                    {separator("總計列表")}
                    <div className="my-2 space-y-2 font-semibold" style={{ fontSize: '32px', lineHeight: '1.3' }}>
                        {Object.entries(summary).map(([key, items]) => (
                            <div key={key}>
                                <strong>{summaryTitles[key]}:</strong>
                                {Object.entries(items).map(([name, quantity]) => (
                                    <p key={name} className="pl-2">- {name} x{quantity}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
