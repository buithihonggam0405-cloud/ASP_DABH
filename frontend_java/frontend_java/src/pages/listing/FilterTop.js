import React from "react";
import { IonIcon } from "@ionic/react";
import { homeOutline, filterOutline } from "ionicons/icons";
import { Link } from "react-router-dom";

const FilterTop = ({ title = "Danh sách sản phẩm", categoryId }) => {
    return (
        <div className="card mb-3 shadow-sm border-0">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-2 font-weight-bold"> Vị trí: </div>
                    <nav className="col-md-8">
                        <ol className="breadcrumb bg-transparent p-0 mb-0">
                            <li className="breadcrumb-item">
                                <Link to="/" className="text-muted">
                                    <IonIcon icon={homeOutline} style={{ verticalAlign: "-2px" }} /> Trang chủ
                                </Link>
                            </li>
                            {categoryId ? (
                                <li className="breadcrumb-item active" aria-current="page">
                                    {title}
                                </li>
                            ) : (
                                <li className="breadcrumb-item active" aria-current="page">
                                    Tất cả sản phẩm
                                </li>
                            )}
                        </ol>
                    </nav>
                </div>

                <hr />

                <div className="row align-items-center">
                    <div className="col-md-2 font-weight-bold d-flex align-items-center">
                        <IonIcon icon={filterOutline} className="mr-2" /> Lọc theo
                    </div>
                    <div className="col-md-10">
                        <span className="text-muted small">
                            * Lọc chi tiết nằm ở sidebar bên trái (giá, …)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterTop;
