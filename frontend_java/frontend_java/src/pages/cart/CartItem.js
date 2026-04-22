import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { addOutline, removeOutline, trashOutline } from "ionicons/icons";
import { GET_IMG } from "../../config/apiService";

const CartItem = ({ item, onToggle, onQuantityChange, onDelete }) => {
    return (
        <tr>
            <td>
                <figure className="itemside align-items-center">
                    <div className="aside">
                        <div className="custom-control custom-checkbox mb-2">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`check-${item.productId}`}
                                checked={item.isChecked}
                                onChange={() => onToggle(item.productId)}
                            />
                            <label className="custom-control-label" htmlFor={`check-${item.productId}`}></label>
                        </div>
                        <img src={GET_IMG(item.image)} className="img-sm border rounded" alt="item" />
                    </div>
                    <figcaption className="info">
                        <Link to={`/product-detail/${item.productId}`} className="title text-dark font-weight-bold">
                            {item.productName}
                        </Link>
                        <p className="text-muted small">Mã SP: #{item.productId}</p>
                    </figcaption>
                </figure>
            </td>
            <td>
                <div className="input-group input-spinner">
                    <div className="input-group-prepend">
                        <button
                            className="btn btn-light"
                            type="button"
                            onClick={() => onQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
                        >
                            <IonIcon icon={removeOutline} />
                        </button>
                    </div>
                    <input type="text" className="form-control" readOnly value={item.quantity} />
                    <div className="input-group-append">
                        <button
                            className="btn btn-light"
                            type="button"
                            onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                        >
                            <IonIcon icon={addOutline} />
                        </button>
                    </div>
                </div>
            </td>
            <td>
                <div className="price-wrap">
                    <var className="price">{Number(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ</var>
                    <small className="text-muted"> {Number(item.unitPrice).toLocaleString('vi-VN')}đ / cái </small>
                </div>
            </td>
            <td className="text-right">
                <button className="btn btn-light text-danger" onClick={() => onDelete(item.productId)}>
                    <IonIcon icon={trashOutline} />
                </button>
            </td>
        </tr>
    );
};

export default CartItem;
