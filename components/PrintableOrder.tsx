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
        let printWindow = null;
        
        const printAutomatically = () => {
            // 創建新的視窗來列印
            printWindow = window.open('', '_blank');
            
            if (!printWindow) {
                // 如果彈出視窗被阻擋，使用當前視窗
                printInCurrentWindow();
                return;
            }
            
            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>列印訂單</title>
                    <style>
                        @media print {
                            @page {
                                margin: 0;
                                size: 80mm auto;
                            }
                            body {
                                margin: 0;
                                padding: 10px;
                                font-size: 36px;
                                font-weight: bold;
                                font-family: Arial, sans-serif;
                                line-height: 1.2;
                            }
                        }
                        body {
                            margin: 0;
                            padding: 10px;
                            font-size: 36px;
                            font-weight: bold;
                            font-family: Arial, sans-serif;
                            line-height: 1.2;
                            width: 350px;
                            margin: 0 auto;
                        }
                    </style>
                </head>
                <body>
                    <div style="margin-bottom: 15px; text-align: center;">
                        單號: ${finalOrderId} 餐點內容 -
                    </div>
                    <div style="margin-bottom: 15px; text-align: center;">
                        餐點總計: $2237
                    </div>
                    <div style="margin-bottom: 15px; text-align: center;">
                        小計
                    </div>
                    <div style="margin-bottom: 15px;">
                        <div style="margin-bottom: 10px;">板腱牛排+脆皮炸雞(炸魚)套餐 x3($1737)</div>
                        <div style="margin-bottom: 10px; text-align: center;">數量</div>
                        <div>英式炸魚套餐 x2($500)</div>
                    </div>
                    <div style="margin: 15px 0; text-align: center; border-top: 2px solid black; padding-top: 10px;">
                        - 總計列表 -
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="margin-bottom: 6px;">炸物總計:</div>
                        <div style="padding-left: 20px;">
                            <div>- 炸魚 x3</div>
                        </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="margin-bottom: 6px;">飲料總計:</div>
                        <div style="padding-left: 20px;">
                            <div>- 無糖紅茶 x3</div>
                            <div>- 冰涼可樂 x2</div>
                        </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="margin-bottom: 6px;">醬料總計:</div>
                        <div style="padding-left: 20px;">
                            <div>- 泡菜 x4</div>
                            <div>- 生蒜片 x2</div>
                            <div>- 黑胡椒 x2</div>
                            <div>- 巴薩米克醋 x1</div>
                            <div>- 蒜味醬 x1</div>
                        </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="margin-bottom: 6px;">牛肉熟度總計:</div>
                        <div style="padding-left: 20px;">
                            <div>- 3分熟 x3</div>
                            <div>- 5分熟 x3</div>
                            <div>- 7分熟 x3</div>
                        </div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="margin-bottom: 6px;">加購總計:</div>
                        <div style="padding-left: 20px;">
                            <div>- 豬排加購 5oz x2</div>
                        </div>
                    </div>
                    <script>
                        // 自動列印並關閉
                        setTimeout(() => {
                            window.print();
                            setTimeout(() => {
                                window.close();
                            }, 500);
                        }, 100);
                    </script>
                </body>
                </html>
            `;
            
            printWindow.document.write(printContent);
            printWindow.document.close();
        };
        
        const printInCurrentWindow = () => {
            // 設置列印樣式
            const printStyle = \`
                @media print {
                    @page {
                        margin: 0;
                        size: 80mm auto;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        font-size: 36px !important;
                        font-weight: bold !important;
                    }
                    * {
                        font-size: 36px !important;
                        font-weight: bold !important;
                    }
                }
                @media screen {
                    .no-print {
                        display: none !important;
                    }
                }
            \`;
            
            const style = document.createElement('style');
            style.innerHTML = printStyle;
            document.head.appendChild(style);
            
            setTimeout(() => {
                window.print();
                // 列印後強制重新導向
                setTimeout(() => {
                    window.location.href = window.location.origin + window.location.pathname + '?print=done&t=' + Date.now();
                }, 1000);
            }, 500);
        };
        
        printAutomatically();
        
        // 清理函數
        return () => {
            if (printWindow && !printWindow.closed) {
                printWindow.close();
            }
        };
    }, [finalOrderId]);
    
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

            {/* 牛肉熟度總計 */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ marginBottom: '6px' }}>牛肉熟度總計:</div>
                <div style={{ paddingLeft: '20px' }}>
                    <div>- 3分熟 x3</div>
                    <div>- 5分熟 x3</div>
                    <div>- 7分熟 x3</div>
                </div>
            </div>

            {/* 加購總計 */}
            <div style={{ marginBottom: '12px' }}>
                <div style={{ marginBottom: '6px' }}>加購總計:</div>
                <div style={{ paddingLeft: '20px' }}>
                    <div>- 豬排加購 5oz x2</div>
                </div>
            </div>
        </div>
    );
};
