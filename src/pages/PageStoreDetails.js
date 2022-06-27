import StoreDetails from "../components/StoreDetails";
import { useParams } from "react-router-dom";

const PageStoreDetails = () => {
  const { storeId } = useParams();
  return (
    <div>
      <StoreDetails storeDir={storeId} />
    </div>
  );
};

export default PageStoreDetails;
