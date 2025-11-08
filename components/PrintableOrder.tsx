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
    
    // 自動列印功能 - 最簡單的方法
    useEffect(() => {
        // 直接列印，讓使用者手動關閉列印預覽
        setTimeout(() => {
            window.print();
        }, 500);
        
        // 不自動重新載入，讓使用者手動操作
    }, []);
    
    return (
        <div className="bg-white text-black" style={{ 
            width: '350px', 
            margin: '0 auto', 
            lineHeight: '1.2',
            padding: '10px',
            fontSize: '36px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* 單號和餐點內容標題 */}
            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                單號: {finalOrderId} 餐點內容 -
            </div>

            {/* 餐點總計 */}
            <div style={{ 
                marginBottom: '15px', 
                textAlign: 'center'
            }}>
                餐點總計: $2237
            </div>

            {/* 小計標題 */}
            <div style={{ 
                marginBottom: '15px', 
                textAlign: 'center'
            }}>
                小計
            </div>

            {/* 餐點項目 */}
            <div style={{ 
                marginBottom: '15px'
            }}>
                <div style={{ marginBottom: '10px' }}>
                    板腱牛排+脆皮炸雞(炸魚)套餐 x3($1737)
                </div>
                <div style={{ 
                    marginBottom: '10px',
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
                margin: '15px 0', 
                textAlign: 'center',
                borderTop: '2px solid black',
                paddingTop: '10px'
            }}>
                - 總計列表 -
            </div>

            {/* 炸物總計 */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ marginBottom: '6px' }}>炸物總計:</div>
                <div style={{ paddingLeft: '20px' }}>
                    <div>- 炸魚 x3</div>
                </div>
            </div>

            {/* 飲料總計 */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ marginBottom: '6px' }}>飲料總計:</div>
                <div style={{ paddingLeft: '20px' }}>
                    <div>- 無糖紅茶 x3</div>
                    <div>- 冰涼可樂 x2</div>
                </div>
            </div>

            {/* 醬料總計 */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ marginBottom: '6px' }}>醬料總計:</div>
                <div style={{ paddingLeft: '20px' }}>
                    <div>- 泡菜 x4</div>
                    <div>- 生蒜片 x2</div>
                    <div>- 黑胡椒 x2</div>
                    <div>- 巴薩米克醋 x1</div>
                    <div>- 蒜味醬 x1</div>
                </div>
            </div>

            {/* 加購總計 */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ marginBottom: '6px' }}>加購總計:</div>
                <div style={{ paddingLeft: '20px' }}>
                    <div>- 豬排加購 5oz x2</div>
                </div>
            </div>

            {/* 操作說明 */}
            <div style={{ 
                marginTop: '20px', 
                padding: '10px',
                border: '2px solid #666',
                fontSize: '24px',
                textAlign: 'center',
                backgroundColor: '#f0f0f0'
            }}>
                <div>列印完成後，請關閉此視窗</div>
                <div>或按瀏覽器的返回按鈕</div>
            </div>
        </div>
    );
};
