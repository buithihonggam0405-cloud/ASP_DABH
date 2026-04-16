import React, { useEffect, useRef, useState } from "react";
import { IonIcon } from "@ionic/react";
import {
    chatbubbleEllipsesOutline,
    closeOutline,
    sendOutline,
    removeOutline,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";

const NODE_SERVER_URL = "http://localhost:3001";
const SPRING_IMAGE_URL = "http://localhost:8080/api/public/products/image";

export default function ChatWidget() {
    const navigate = useNavigate();
    const listRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            id: "1",
            role: "model",
            text:
                'Chào bạn! 👋 Mình là trợ lý AI. Bạn muốn tư vấn gì nào?',
        },
    ]);

    // Auto scroll khi có tin nhắn mới (nếu đang mở)
    useEffect(() => {
        if (!open || minimized) return;
        const t = setTimeout(() => {
            if (!listRef.current) return;
            listRef.current.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: "smooth",
            });
        }, 80);
        return () => clearTimeout(t);
    }, [messages, open, minimized]);

    const getImageUrl = (imgName) => {
        if (!imgName) return "https://via.placeholder.com/150";
        if (String(imgName).startsWith("http")) return imgName;
        return `${SPRING_IMAGE_URL}/${imgName}`;
    };

    const formatPrice = (n) => `${Number(n || 0).toLocaleString("vi-VN")}đ`;

    // ✅ GIỮ LOGIC: historyForBot = messages.slice(1)
    const buildHistoryForBot = (baseMessages) =>
        (baseMessages || [])
            .slice(1)
            .map((m) => ({
                role: m.role === "user" ? "user" : "model",
                parts: [{ text: m.text }],
            }));

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            text: input.trim(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const userEmail = localStorage.getItem("user-email") || "guest@example.com";
            const token = localStorage.getItem("jwt-token") || "";

            // ✅ IMPORTANT: dùng messages cũ (chưa gồm userMsg) giống RN
            const historyForBot = buildHistoryForBot(messages);

            const res = await fetch(`${NODE_SERVER_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg.text,
                    history: historyForBot,
                    userEmail,
                    token,
                }),
            });

            const data = await res.json();

            const botMsg = {
                id: (Date.now() + 1).toString(),
                role: "model",
                text: data?.text || "Xin lỗi, mình chưa hiểu ý bạn.",
                products: data?.products || [],
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), role: "model", text: "❌ Lỗi kết nối server." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ GIỮ LOGIC: bấm "Chọn mua" => /cart/add
    const buyNow = async (p) => {
        const userEmail = localStorage.getItem("user-email");
        const token = localStorage.getItem("jwt-token");

        if (!userEmail || !token) {
            alert("Vui lòng đăng nhập để mua hàng");
            navigate("/login");
            return;
        }

        try {
            const res = await fetch(`${NODE_SERVER_URL}/cart/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail,
                    productId: p.productId,
                    quantity: 1,
                    token,
                }),
            });

            const data = await res.json();
            alert(
                `${data?.ok ? "✅ Thành công" : "❌ Lỗi"}\n${data?.message || "Không thể thêm vào giỏ"
                }`
            );
        } catch (e) {
            alert("❌ Lỗi\nKhông thể kết nối server");
        }
    };

    const onKeyDown = (e) => {
        // Enter gửi, Shift+Enter xuống dòng
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const panelVisible = open && !minimized;

    return (
        <>
            {/* Floating open button */}
            {!open && (
                <button
                    type="button"
                    onClick={() => {
                        setOpen(true);
                        setMinimized(false);
                    }}
                    style={styles.fab}
                    title="Chat"
                >
                    <IonIcon icon={chatbubbleEllipsesOutline} style={{ fontSize: 22, color: "#fff" }} />
                </button>
            )}

            {/* Chat panel */}
            {open && (
                <div style={styles.panelWrap}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.headerLeft}>
                            <div style={styles.dot} />
                            <div>
                                <div style={styles.headerTitle}>Trợ lý AI</div>
                                <div style={styles.headerSub}>Hỏi “sp hot”, “sp mới”, hoặc tên sản phẩm</div>
                            </div>
                        </div>

                        <div style={styles.headerRight}>
                            <button
                                type="button"
                                onClick={() => setMinimized((s) => !s)}
                                style={styles.iconBtn}
                                title={minimized ? "Mở rộng" : "Thu nhỏ"}
                            >
                                <IonIcon icon={removeOutline} style={{ fontSize: 18, color: "#1f2937" }} />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    setMinimized(false);
                                }}
                                style={styles.iconBtn}
                                title="Đóng"
                            >
                                <IonIcon icon={closeOutline} style={{ fontSize: 18, color: "#1f2937" }} />
                            </button>
                        </div>
                    </div>

                    {/* Minimized bar */}
                    {minimized && (
                        <div style={styles.minBar} onClick={() => setMinimized(false)}>
                            <IonIcon icon={chatbubbleEllipsesOutline} style={{ fontSize: 18, marginRight: 8 }} />
                            <span style={{ fontWeight: 700 }}>Trợ lý AI</span>
                            <span style={{ color: "#6b7280", marginLeft: 8, fontSize: 12 }}>(bấm để mở)</span>
                        </div>
                    )}

                    {/* Body + Input */}
                    {panelVisible && (
                        <>
                            <div ref={listRef} style={styles.body}>
                                {messages.map((m) => {
                                    const isUser = m.role === "user";

                                    return (
                                        <div
                                            key={m.id}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: isUser ? "flex-end" : "flex-start",
                                                margin: "8px 0",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: 10,
                                                    borderRadius: 14,
                                                    maxWidth: "85%",
                                                    fontSize: 14,
                                                    backgroundColor: isUser ? "#007AFF" : "#E5E5EA",
                                                    color: isUser ? "#fff" : "#000",
                                                    borderBottomRightRadius: isUser ? 4 : 14,
                                                    borderBottomLeftRadius: !isUser ? 4 : 14,
                                                    whiteSpace: "pre-wrap",
                                                    lineHeight: "18px",
                                                }}
                                            >
                                                {m.text}
                                            </div>

                                            {!isUser && m.products && m.products.length > 0 && (
                                                <div style={{ marginTop: 8, width: "100%" }}>
                                                    {m.products.map((p, idx) => (
                                                        <div key={p.productId} style={styles.productCard}>
                                                            <img
                                                                src={getImageUrl(p.image)}
                                                                alt={p.productName}
                                                                style={styles.productImage}
                                                                onError={(e) => {
                                                                    e.currentTarget.src = "https://via.placeholder.com/150";
                                                                }}
                                                            />

                                                            <div style={{ marginLeft: 10, flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>
                                                                    #{idx + 1}
                                                                </div>

                                                                <div style={styles.productName} title={p.productName}>
                                                                    {p.productName}
                                                                </div>

                                                                <div style={styles.productPrice}>
                                                                    {formatPrice(p.specialPrice || p.price)}
                                                                </div>

                                                                {!!p.specialPrice && Number(p.specialPrice) < Number(p.price) && (
                                                                    <div style={styles.oldPrice}>{formatPrice(p.price)}</div>
                                                                )}

                                                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                                                                    <button type="button" onClick={() => buyNow(p)} style={styles.buyBtn}>
                                                                        Chọn mua
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setInput(`mua cái số ${idx + 1}`)}
                                                                        style={styles.hintBtn}
                                                                    >
                                                                        Gõ: “mua cái số {idx + 1}”
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={styles.inputWrap}>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    placeholder='Nhập tin nhắn... (vd: "sp hot", "iphone", "mua cái số 2")'
                                    style={styles.textarea}
                                />
                                <button
                                    type="button"
                                    onClick={sendMessage}
                                    disabled={loading}
                                    style={{
                                        ...styles.sendBtn,
                                        opacity: loading ? 0.7 : 1,
                                        cursor: loading ? "not-allowed" : "pointer",
                                    }}
                                    title="Gửi"
                                >
                                    {loading ? (
                                        <span style={{ color: "#fff", fontSize: 12 }}>...</span>
                                    ) : (
                                        <IonIcon icon={sendOutline} style={{ fontSize: 18, color: "#fff" }} />
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}

const styles = {
    fab: {
        position: "fixed",
        right: 18,
        bottom: 18,
        width: 54,
        height: 54,
        borderRadius: 27,
        border: "none",
        background: "#007AFF",
        boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        cursor: "pointer",
    },
    panelWrap: {
        position: "fixed",
        right: 18,
        bottom: 18,
        width: 360,
        maxWidth: "calc(100vw - 36px)",
        borderRadius: 14,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 15px 40px rgba(0,0,0,0.18)",
        zIndex: 9999,
        border: "1px solid rgba(0,0,0,0.06)",
    },
    header: {
        background: "#fff",
        borderBottom: "1px solid #eee",
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    headerLeft: { display: "flex", alignItems: "center", gap: 10 },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 10,
        background: "#22c55e",
        boxShadow: "0 0 0 4px rgba(34,197,94,0.15)",
    },
    headerTitle: { fontWeight: 800, color: "#111827", fontSize: 14, lineHeight: "16px" },
    headerSub: { fontSize: 12, color: "#6b7280", marginTop: 2 },
    headerRight: { display: "flex", alignItems: "center", gap: 6 },
    iconBtn: {
        border: "none",
        background: "#f3f4f6",
        width: 32,
        height: 32,
        borderRadius: 10,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    body: {
        height: 420,
        maxHeight: "55vh",
        overflowY: "auto",
        padding: 12,
        background: "#f5f5f5",
    },
    inputWrap: {
        display: "flex",
        gap: 10,
        padding: 10,
        background: "#fff",
        borderTop: "1px solid #eee",
        alignItems: "center",
    },
    textarea: {
        flex: 1,
        background: "#f0f0f0",
        padding: "10px 12px",
        borderRadius: 18,
        border: "none",
        outline: "none",
        resize: "none",
        height: 40,
        lineHeight: "18px",
        fontSize: 13,
    },
    sendBtn: {
        background: "#007AFF",
        width: 40,
        height: 40,
        borderRadius: 20,
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    minBar: {
        padding: "12px 12px",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    },
    productCard: {
        display: "flex",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 12,
        marginBottom: 8,
        width: "100%",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    },
    productImage: {
        width: 64,
        height: 64,
        borderRadius: 10,
        backgroundColor: "#eee",
        objectFit: "cover",
        flexShrink: 0,
    },
    productName: {
        fontWeight: 700,
        fontSize: 13,
        marginBottom: 4,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    productPrice: { color: "#D0021B", fontWeight: 800, fontSize: 13 },
    oldPrice: { textDecoration: "line-through", color: "#999", fontSize: 12 },
    buyBtn: {
        backgroundColor: "#D0021B",
        color: "#fff",
        padding: "7px 12px",
        borderRadius: 8,
        border: "none",
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
    },
    hintBtn: {
        background: "transparent",
        border: "1px solid rgba(0,122,255,0.35)",
        color: "#007AFF",
        padding: "6px 10px",
        borderRadius: 8,
        fontSize: 12,
        cursor: "pointer",
    },
};
