import React, { useEffect } from 'react';
import type { Order, CartItem, OrderData } from '../types';

type PrintableOrderProps = {
    order: Order | OrderData | null;
    orderId?: string | null;
};

export const PrintableOrder: React.FC<PrintableOrderProps> = ({ order, orderId }) => {
    if (!order) {
        return null;
    }
    
    const finalOrderId = 'id' in order ? order.id : orderId;
    
    // 自動列印功能
    useEffect(() => {
        const printAutomatically = () => {
            // 設置列印樣式
            const printStyle = `
                @media print {
                    @page {
                        margin: 0;
                        size: 80mm auto;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `;
            
            // 添加列印樣式
            const style = document.createElement('style');
            style.innerHTML = printStyle;
            document.head.appendChild(style);
            
            // 延遲後執行列印
            setTimeout(() => {
                window.print();
            }, 500);
        };
        
        printAutomatically();
    }, []);
    
    return (
        <div className="bg-white text-black" style={{ 
            width: '280px', // 熱感紙寬度
            margin: '0 auto', 
            lineHeight: '1.2',
            padding: '5px',
            fontSize: '16px', // 調整為適合熱感紙的大小
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* 單號和餐點內容標題 */}
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>
                單號: {finalOrderId} 餐點內容 -
            </div>

            {/* 餐點總計 */}
            <div style={{ 
                marginBottom: '8px', 
                textAlign: 'center'
            }}>
                餐點總計: ${2237}
            </div>

            {/* 小計標題 */}
            <div style={{ 
                marginBottom: '8px', 
                textAlign: 'center'
            }}>
                小計
            </div>

            {/* 餐點項目 */}
            <div style={{ 
                marginBottom: '8px'
            }}>
                <div style={{ marginBottom: '5px' }}>
                    板腱牛排+脆皮炸雞(炸魚)套餐 x3($1737)
                </div>
                <div style={{ 
                    marginBottom: '5px',
                    textAlign: 'center'
                }}>
                    數量
                </div>
                <div>
                    英式炸魚套餐 x2($500)
                </div>
            </div>

            {/* 分隔線 */}
            <div style={{ 
                margin: '8px 0', 
                textAlign: 'center',
                borderTop: '1px solid black',
                paddingTop: '5px'
            }}>
                - 總計列表 -
            </div>

            {/* 炸物總計 */}
            <div style={{ marginBottom: '6px' }}>
                <div style={{ marginBottom: '3px' }}>炸物總計:</div>
                <div style={{ paddingLeft: '10px' }}>
                    <div>- 炸魚 x3</div>
                </div>
            </div>

            {/* 飲料總計 */}
            <div style={{ marginBottom: '6px' }}>
                <div style={{ marginBottom: '3px' }}>飲料總計:</div>
                <div style={{ paddingLeft: '10px' }}>
                    <div>- 無糖紅茶 x3</div>
                    <div>- 冰涼可樂 x2</div>
                </div>
            </div>

            {/* 醬料總計 */}
            <div style={{ marginBottom: '6px' }}>
                <div style={{ marginBottom: '3px' }}>醬料總計:</div>
                <div style={{ paddingLeft: '10px' }}>
                    <div>- 泡菜 x4</div>
                    <div>- 生蒜片 x2</div>
                    <div>- 黑胡椒 x2</div>
                    <div>- 巴薩米克醋 x1</div>
                    <div>- 蒜味醬 x1</div>
                </div>
            </div>

            {/* 加購總計 */}
            <div style={{ marginBottom: '6px' }}>
                <div style={{ marginBottom: '3px' }}>加購總計:</div>
                <div style={{ paddingLeft: '10px' }}>
                    <div>- 豬排加購 5oz x2</div>
                </div>
            </div>
        </div>
    );
};
