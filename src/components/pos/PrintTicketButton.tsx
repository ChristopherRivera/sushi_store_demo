import { Printer } from 'lucide-react';
import type { Order } from '@/lib/types';
import { mockProducts } from '@/lib/mockData';

interface PrintTicketButtonProps {
    order: Order;
    className?: string;
}

export function PrintTicketButton({ order, className = "" }: PrintTicketButtonProps) {
    if (!order) return null;

    const handlePrint = () => {
        const ticketId = order.id;
        const printContent = document.getElementById(`ticket-${ticketId}`);
        if (!printContent) return;

        const windowPrint = window.open('', '', 'width=800,height=900');
        if (!windowPrint) return;

        windowPrint.document.write(`
            <html>
                <head>
                    <title>Ticket Pedido #${order.orderNumber}</title>
                    <style>
                        @page { margin: 0; size: 80mm auto; }
                        body { font-family: 'Courier New', Courier, monospace; width: 80mm; margin: 0; padding: 5mm; font-size: 16px; line-height: 1.4; color: #000; background: #fff; font-weight: bold; text-transform: uppercase; }
                        .text-center { text-align: center; }
                        .bold { font-weight: bold; }
                        .divider { border-top: 2px dashed #000; margin: 4mm 0; }
                        .header { margin-bottom: 5mm; }
                        .header h1 { font-size: 24px; margin: 0; text-transform: uppercase; }
                        .header p { margin: 2px 0; font-size: 14px; }
                        .item { display: flex; justify-content: space-between; margin-bottom: 1mm; }
                        .item-name { flex: 1; padding-right: 2mm; }
                        .addon-item { font-size: 13px; padding-left: 6mm; font-style: italic; display: flex; justify-content: space-between; margin-bottom: 0.5mm; }
                        .total-section { margin-top: 6mm; }
                        .footer { margin-top: 10mm; font-size: 14px; }
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
                className={`p-1.5 rounded-lg transition-colors bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-500 dark:text-slate-400 hover:text-indigo-500 ${className}`}
                title="Imprimir Ticket Cliente"
            >
                <Printer size={14} />
            </button>

            <div id={`ticket-${order.id}`} className="hidden" style={{ display: 'none' }}>
                <div className="text-center header">
                    <h1 className="bold">PORTAFOLIO POS</h1>
                    <p>CHRISTOPHER RIVERA</p>
                    <p>DESARROLLADOR FRONTEND</p>
                </div>

                <div className="divider"></div>

                <div>
                    <p><span className="bold">PEDIDO N°:</span> {order.orderNumber}</p>
                    <p><span className="bold">FECHA:</span> {new Date(order.createdAt).toLocaleString('es-CL')}</p>
                    <p><span className="bold">CLIENTE:</span> {order.customerName}</p>
                    <p><span className="bold">DESPACHO:</span> {order.deliveryAddress || 'RETIRO EN LOCAL'}</p>
                </div>

                <div className="divider"></div>

                <div className="bold item">
                    <span className="item-name">CANT   PRODUCTO</span>
                    <span>TOTAL</span>
                </div>
                
                <div className="divider"></div>

                {order.items?.map((item, idx) => {
                    const product = mockProducts.find(p => p.id === item.productId);
                    return (
                    <div key={idx} style={{ marginBottom: '3mm' }}>
                        <div className="item">
                            <span className="item-name">{item.quantity}x {product ? product.name : 'Item'}</span>
                            <span>${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                        </div>
                        
                        {item.addons?.map((addon, aidx) => (
                            <div key={aidx} className="addon-item">
                                <span>+ {addon.name} {addon.quantity && addon.quantity > 1 ? `(x${addon.quantity})` : ''}</span>
                                <span>${(addon.price * (addon.quantity || 1) * item.quantity).toLocaleString('es-CL')}</span>
                            </div>
                        ))}

                        {item.comment && (
                            <div style={{ fontSize: '12px', paddingLeft: '6mm', marginTop: '1mm', fontStyle: 'italic', opacity: 0.8 }}>
                                NOTA: {item.comment}
                            </div>
                        )}
                    </div>
                )})}

                <div className="divider"></div>

                <div className="total-section">
                    {order.deliveryCost && order.deliveryCost > 0 && (
                        <>
                            <div className="item">
                                <span>SUBTOTAL:</span>
                                <span>${(order.total - order.deliveryCost).toLocaleString('es-CL')}</span>
                            </div>
                            <div className="item">
                                <span>ENVÍO:</span>
                                <span>${order.deliveryCost.toLocaleString('es-CL')}</span>
                            </div>
                        </>
                    )}
                    <div className="item bold" style={{ fontSize: '20px' }}>
                        <span>TOTAL:</span>
                        <span>${order.total.toLocaleString('es-CL')}</span>
                    </div>
                    
                    <div className="divider"></div>
                    
                    <p><span className="bold">PAGO:</span> {order.paymentMethod}</p>
                    <p><span className="bold">ESTADO:</span> {order.status}</p>

                </div>

                <div className="divider"></div>

                <div className="text-center footer">
                    <p>PROYECTO DE DEMOSTRACIÓN</p>
                    <p>W W W . S E R V I T E C H N O L O G Y . C L</p>
                    <p style={{ fontSize: '12px', marginTop: '2mm' }}>GITHUB: ChristopherRivera</p>
                </div>
            </div>
        </>
    );
}
