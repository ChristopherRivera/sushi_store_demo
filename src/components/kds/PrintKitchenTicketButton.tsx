import { ChefHat } from 'lucide-react';
import type { Order } from '@/lib/types';
import { mockProducts } from '@/lib/mockData';

interface PrintKitchenTicketButtonProps {
    order: Order;
    className?: string;
}

export function PrintKitchenTicketButton({ order, className = "" }: PrintKitchenTicketButtonProps) {
    if (!order) return null;

    const handlePrint = () => {
        const ticketId = order.id;
        const printContent = document.getElementById(`kitchen-ticket-${ticketId}`);
        if (!printContent) return;

        const windowPrint = window.open('', '', 'width=800,height=900');
        if (!windowPrint) return;

        windowPrint.document.write(`
            <html>
                <head>
                    <title>Comanda Cocina #${order.orderNumber}</title>
                    <style>
                        @page { margin: 0; size: 80mm auto; }
                        body { font-family: 'Courier New', Courier, monospace; width: 80mm; margin: 0; padding: 5mm; font-size: 20px; line-height: 1.1; color: #000; background: #fff; font-weight: 800; text-transform: uppercase; }
                        .text-center { text-align: center; }
                        .bold { font-weight: 900; }
                        .divider { border-top: 4px solid #000; margin: 4mm 0; }
                        .header { margin-bottom: 5mm; }
                        .header h1 { font-size: 36px; margin: 0; }
                        .order-number { font-size: 60px; display: block; margin: 2mm 0; font-family: sans-serif; }
                        .item-container { margin-bottom: 6mm; }
                        .item { display: flex; align-items: flex-start; margin-bottom: 2mm; }
                        .item-qty { font-size: 40px; margin-right: 4mm; border: 3px solid #000; padding: 0 2mm; min-width: 1.2em; text-align: center; }
                        .item-name { font-size: 28px; flex: 1; padding-top: 1mm; }
                        .addon-item { font-size: 20px; padding-left: 10mm; margin-bottom: 1mm; font-weight: 900; }
                        .comment { margin-top: 2mm; background: #000; color: #fff; padding: 3mm; font-size: 24px; border: 1px solid #000; display: block; }
                        .footer { margin-top: 10mm; font-size: 16px; border-top: 2px dashed #000; padding-top: 4mm; }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                    <script>
                        window.onload = () => { window.print(); window.close(); };
                    </script>
                </body>
            </html>
        `);
        windowPrint.document.close();
    };

    return (
        <>
            <button 
                onClick={handlePrint}
                className={`p-1.5 rounded-lg transition-colors bg-white/5 border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/30 text-slate-500 dark:text-slate-400 hover:text-amber-500 ${className}`}
                title="Imprimir Comanda Cocina"
            >
                <ChefHat size={14} />
            </button>

            <div id={`kitchen-ticket-${order.id}`} className="hidden" style={{ display: 'none' }}>
                <div className="text-center header">
                    <h1 className="bold">PORTAFOLIO POS</h1>
                    <span className="order-number bold">#{order.orderNumber}</span>
                    <p style={{ fontSize: '22px' }}>{new Date(order.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <div className="divider"></div>

                <div style={{ fontSize: '24px' }}>
                    <p><span className="bold">CLIENTE:</span> {order.customerName}</p>
                    <p><span className="bold">TIPO:</span> {order.deliveryAddress ? 'DESPACHO' : 'RETIRO EN LOCAL'}</p>
                </div>

                <div className="divider"></div>

                {order.items?.map((item, idx) => {
                    const product = mockProducts.find(p => p.id === item.productId);
                    return (
                    <div key={idx} className="item-container">
                        <div className="item">
                            <span className="item-qty">{item.quantity}</span>
                            <span className="item-name bold">{product ? product.name : 'Item'}</span>
                        </div>
                        
                        {item.addons?.map((addon, aidx) => (
                            <div key={aidx} className="addon-item">
                                + {addon.name} {addon.quantity && addon.quantity > 1 ? `(x${addon.quantity})` : ''}
                            </div>
                        ))}

                        {item.comment && (
                            <div className="comment">
                                NOTA: {item.comment}
                            </div>
                        )}
                    </div>
                )})}

                <div className="text-center footer">
                    <p className="bold">--- FINAL DE COMANDA ---</p>
                </div>
            </div>
        </>
    );
}
