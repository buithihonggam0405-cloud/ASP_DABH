import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";

const Sidebar = ({ priceMin, priceMax, onApplyPrice }) => {
    const [min, setMin] = useState(priceMin || "");
    const [max, setMax] = useState(priceMax || "");

    const apply = () => {
        onApplyPrice?.({ min, max });
    };

    const reset = () => {
        setMin("");
        setMax("");
        onApplyPrice?.({ min: "", max: "" });
    };

    return (
        <aside className="col-md-2">
            <article className="filter-group mb-3">
                <header className="card-header bg-white border-bottom-0 p-0 mb-2">
                    <div className="d-flex align-items-center justify-content-between text-dark font-weight-bold">
                        <span>Khoảng giá</span>
                        <IonIcon icon={chevronDownOutline} style={{ fontSize: "1rem" }} />
                    </div>
                </header>

                <div className="filter-content collapse show">
                    <div className="inner">
                        <div className="form-row">
                            <div className="form-group col-12">
                                <label className="small text-muted">Min</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="0"
                                    value={min}
                                    onChange={(e) => setMin(e.target.value)}
                                />
                            </div>
                            <div className="form-group col-12">
                                <label className="small text-muted">Max</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    placeholder="100000"
                                    value={max}
                                    onChange={(e) => setMax(e.target.value)}
                                />
                            </div>
                        </div>

                        <button className="btn btn-block btn-primary btn-sm mb-2" type="button" onClick={apply}>
                            Áp dụng
                        </button>
                        <button className="btn btn-block btn-light btn-sm" type="button" onClick={reset}>
                            Reset
                        </button>
                    </div>
                </div>
            </article>

            {/* Các filter khác bạn có thể thêm sau, nhưng vẫn giữ logic ở Listing */}
        </aside>
    );
};

export default Sidebar;
