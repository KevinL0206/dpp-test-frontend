import { useRouter} from 'next/navigation';
import { PageView } from '../[uid]/page';
import PlusIcon from '@/icons/ico-plus.svg';
import PlusIconWhite from '@/icons/ico-plus-white.svg';
import LockIcon from '@/icons/ico-lock.svg';
import { User } from '../store/authSlice';
import { ProductRewards } from '../hooks/useGetProductRewards';
import RewardIcon from '@/icons/ico-reward.svg'; 

// Add this enum definition
enum ButtonState {
  ADD = 'Add',
  OWNED = 'Owned',
  CLAIM = 'Claim',
}

interface BottomNavProps {
  pageView: PageView;
  setPageView: (view: PageView) => void;
  user: User | null;
  claimed?: number;
  claimedByCurrentUser?: boolean;
  uid?: string;
  refetch?: () => void;
  productRewards?: ProductRewards;
}

const BottomNav = ({ pageView, setPageView, user, claimed, claimedByCurrentUser, uid, refetch, productRewards }: BottomNavProps) => {
  const router = useRouter();

  const currentButton: ButtonState = claimed
    ? (claimedByCurrentUser ? ButtonState.ADD : ButtonState.OWNED)
    : ButtonState.CLAIM;


  const handleAddClick = () => {
    if (!user) {
      // Get the current URL including path and query parameters
      const currentUrl = new URL(window.location.href);
      const fullPath = currentUrl.pathname + currentUrl.search;
      
      // Encode the full path and add it as a query parameter
      const encodedPath = encodeURIComponent(fullPath);
      
      // Store the full path in localStorage
      localStorage.setItem('redirectAfterAuth', fullPath);
      
      // Redirect to login page with returnUrl
      router.push(`/login?returnUrl=${encodedPath}`);
    } else {
      setPageView(PageView.CREATE);
    }
  };

  const handleClaimClick = () => {
    
    if (!user) {
      // Get the current URL including path and query parameters
      const currentUrl = new URL(window.location.href);
      const fullPath = currentUrl.pathname + currentUrl.search;
      
      // Encode the full path and add it as a query parameter
      const encodedPath = encodeURIComponent(fullPath);
      
      // Store the full path in localStorage
      localStorage.setItem('redirectAfterAuth', fullPath);
      
      // Redirect to login page with returnUrl
      router.push(`/login?returnUrl=${encodedPath}`);
      return;
    }
    
    // if (uid) {
    //   console.log("Claiming tag...");
    //   claimTag(uid)
    //     .then(() => {
    //       console.log("Tag claimed successfully");
    //       refetch?.();
    //     })
    //     .catch((err) => {
    //       console.error('Error claiming tag:', err);
    //       setShowError(true);
    //       setTimeout(() => setShowError(false), 3000);
    //     });
    // } else {
    //   console.log("UID is missing");
    // }

    if (uid) {
      router.push(`/claim/${uid}`);
      } else {
        console.log("UID is missing");
      }
  };

  const handleRewardsClick = () => {
    setPageView(PageView.REWARDS);
    console.log("Show rewards");
  };

  const buttonFunction = claimed 
    ? (claimedByCurrentUser ? handleAddClick : () => {})
    : handleClaimClick;


  return (
    <div className="fixed bottom-[20px] left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-50">
      <nav className="bg-[#03030352] rounded-full shadow-lg px-2 py-1 flex items-center justify-center">
        <ul className="flex justify-center items-center space-x-2">
          <li>
            <button 
              onClick={() => setPageView(PageView.PRODUCT)}
              className={`inline-block px-3 py-2 text-base hover:text-white whitespace-nowrap ${
                pageView === PageView.PRODUCT
                  ? 'font-bold text-white' 
                  : 'font-normal text-[#FFFFFFCC]'
              }`}
            >
              My item
            </button>
          </li>
          <li>
            <button 
              onClick={() => setPageView(PageView.COLLECTION)}
              className={`inline-block px-3 py-2 text-base hover:text-white ${
                pageView === PageView.COLLECTION
                  ? 'font-bold text-white' 
                  : 'font-normal text-[#FFFFFFCC]'
              }`}
            >
              Feed
            </button>
          </li>
        </ul>
      </nav>
      
      {pageView === PageView.COLLECTION && (
        <nav className={`rounded-full shadow-lg px-2 py-1 z-50 flex items-center justify-center ${
          currentButton === ButtonState.OWNED ? 'bg-[#03030352]' : 'bg-white hover:bg-[#03030352]'
        }`}>
          <button 
            onClick={buttonFunction}
            disabled={currentButton === ButtonState.OWNED}
            className={`px-3 py-2 text-base rounded-full font-normal flex flex-row gap-2 items-center justify-center group ${
              currentButton === ButtonState.OWNED ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              currentButton === ButtonState.OWNED ? 'text-white' : 'text-black hover:text-white'
            }`}
          >
              <>
                {claimed && !claimedByCurrentUser && (
                  <>
                    <LockIcon className="w-5 h-5 fill-current" />
                    <span>Owned</span>
                  </>
                )}
                {claimed && claimedByCurrentUser && (
                  <>
                    <PlusIcon className="group-hover:hidden" />
                    <PlusIconWhite className="hidden group-hover:block" />
                    <span>Add</span>
                  </>
                )}
                {!claimed && (
                  <>
                    <PlusIcon className="group-hover:hidden" />
                    <PlusIconWhite className="hidden group-hover:block" />
                    <span>Claim</span>
                  </>
                )}
              </>
            
          </button>
        </nav>
      )}
      
      {pageView === PageView.PRODUCT && (
        <>
          {!claimed && (
            <nav className="bg-white hover:bg-[#03030352] rounded-full shadow-lg px-2 py-1 z-50 flex items-center justify-center">
              <button 
                onClick={handleClaimClick}
                className="px-3 py-2 text-base rounded-full font-normal flex flex-row gap-2 items-center justify-center group text-black hover:text-white"
              >
                <PlusIcon className="group-hover:hidden" />
                <PlusIconWhite className="hidden group-hover:block" />
                <span>Claim</span>
              </button>
            </nav>
          )}
          {claimed && claimedByCurrentUser && productRewards?.rewards && productRewards?.rewards?.length > 0 && (
            <nav className="bg-white hover:bg-[#03030352] rounded-full shadow-lg px-2 py-1 z-50 flex items-center justify-center">
              <button 
                onClick={handleRewardsClick}
                className="px-3 py-2 text-base rounded-full font-normal flex flex-row gap-2 items-center justify-center group text-black hover:text-white"
              >
                <RewardIcon className="w-5 h-5 fill-current" />
                <span>Rewards</span>
              </button>
            </nav>
          )}
        </>
      )}
      
    </div>
  );
};

export default BottomNav;
