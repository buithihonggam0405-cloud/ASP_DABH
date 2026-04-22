import { Link } from 'react-router-dom'

const BannerBottom = () => {
    return (
        <section className="padding-bottom">
            <article className="box d-flex flex-wrap align-items-center p-5 bg-secondary">
                <div className="text-white mr-auto">
                    <h3>Looking for fashion? </h3>
                    <p> Popular items, discounts and free shipping </p>
                </div>
                <div className="mt-3 mt-md-0"><Link to="/fashion" className="btn btn-outline-light">Learn more</Link></div>
            </article>
        </section>
    )
}

export default BannerBottom