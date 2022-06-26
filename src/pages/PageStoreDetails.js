import StoreDetails from "../components/StoreDetails";
import { useParams } from "react-router-dom";

const PageStoreDetails = () => {
  const { storeId } = useParams();
  console.log(storeId);
  return (
    <div>
      <StoreDetails storeDir={storeId} />
    </div>
  );
};

export default PageStoreDetails;
