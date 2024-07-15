import { Anton } from "next/font/google";
const inter = Anton({ subsets: ["latin"], weight: "400" });
import Image from "next/image";
import "./Style.css";

const Ban = () => {
    return (
        <div className="container pq mt-5">
            <div className="row g1 d-flex justify-content-between align-items-center">
                <div className="col-lg-6 g2 col-md-6 text-center">
                    <h1 className={inter.className}>Welcome to Fast Food Heaven!</h1>
                    <h4 style={{ color: "white" }}>Discover the best in pasta, pizza, burgers, and more</h4>
                    <h3 style={{ color: "white" }}>Indulge in our mouthwatering flavors</h3>
                </div>
                <div className="col-lg-6 g3 col-md-6 mt-5 mb-5 text-center">
                    <Image
                        src="/b8.png"
                        alt="Image of delicious fast food"
                        className="img-fluid"
                        style={{ objectFit: "cover" }}
                        width={400}
                        height={170}
                    />
                </div>
            </div>
        </div>
    );
};

export default Ban;
