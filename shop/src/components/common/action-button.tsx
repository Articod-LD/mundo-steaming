import { BanUser } from "@/components/icons/ban-user";
import { EditIcon } from "@/components/icons/edit";
import { TrashIcon } from "@/components/icons/trash";
import { Eye } from "@/components/icons/eye-icon";
import { WalletPointsIcon } from "@/components/icons/wallet-point";
import Link from "@/components/ui/links/anchor-link";
import { STAFF, SUPER_ADMIN } from "@/utils/constants";
import { CheckMarkCircle } from "@/components/icons/checkmark-circle";
import { useModalAction } from "@/components/ui/modal/modal.context";
import { CloseFillIcon } from "@/components/icons/close-fill";
import { AdminIcon } from "@/components/icons/admin-icon";
import { EyeIcon } from "@/components/icons/category/eyes-icon";
import { getAuthCredentials } from "@/utils/auth";
import { useRouter } from "next/router";

type Props = {
  id: string;
  editModalView?: string | any;
  deleteModalView?: string | any;
  editUrl?: string;
  previewUrl?: string;
  enablePreviewMode?: boolean;
  detailsUrl?: string;
  isUserActive?: boolean;
  userStatus?: boolean;
  isShopActive?: boolean;
  approveButton?: boolean;
  termApproveButton?: boolean;
  couponApproveButton?: boolean;
  showAddWalletPoints?: boolean;
  changeRefundStatus?: boolean;
  showMakeAdminButton?: boolean;
  showReplyQuestion?: boolean;
  customLocale?: string;
  isTermsApproved?: boolean;
  isCouponApprove?: boolean;
  flashSaleVendorRequestApproveButton?: boolean;
  isFlashSaleVendorRequestApproved?: boolean;
};

const ActionButtons = ({
  id,
  editModalView,
  deleteModalView,
  editUrl,
  previewUrl,
  enablePreviewMode = false,
  detailsUrl,
  userStatus = false,
  isUserActive = false,
  isShopActive,
  approveButton = false,
  termApproveButton = false,
  showAddWalletPoints = false,
  changeRefundStatus = false,
  showMakeAdminButton = false,
  showReplyQuestion = false,
  customLocale,
  isTermsApproved,
  couponApproveButton,
  isCouponApprove,
  flashSaleVendorRequestApproveButton = false,
  isFlashSaleVendorRequestApproved,
}: Props) => {
  const { openModal } = useModalAction();
  const router = useRouter();
  const { role } = getAuthCredentials();

  function handleDelete() {
    openModal(deleteModalView, id);
  }

  function handleEditModal() {
    openModal(editModalView, id);
  }

  function handleUserStatus(type: string) {
    openModal("BAN_CUSTOMER", { id, type });
  }

  function handleAddWalletPoints() {
    openModal("ADD_WALLET_POINTS", id);
  }

  function handleMakeAdmin() {
    openModal("MAKE_ADMIN", id);
  }

  function handleUpdateRefundStatus() {
    openModal("UPDATE_REFUND", id);
  }

  function handleShopStatus(status: boolean) {
    if (status === true) {
      openModal("SHOP_APPROVE_VIEW", id);
    } else {
      openModal("SHOP_DISAPPROVE_VIEW", id);
    }
  }

  function handleTermsStatus(status: boolean) {
    if (status === true) {
      openModal("TERM_APPROVE_VIEW", id);
    } else {
      openModal("TERM_DISAPPROVE_VIEW", id);
    }
  }

  function handleCouponStatus(status: boolean) {
    if (status === true) {
      openModal("COUPON_APPROVE_VIEW", id);
    } else {
      openModal("COUPON_DISAPPROVE_VIEW", id);
    }
  }

  function handleReplyQuestion() {
    openModal("REPLY_QUESTION", id);
  }

  function handleVendorFlashSaleStatus(status: boolean) {
    if (status !== true) {
      openModal("VENDOR_FS_REQUEST_APPROVE_VIEW", id);
    } else {
      openModal("VENDOR_FS_REQUEST_DISAPPROVE_VIEW", id);
    }
  }

  // TODO: need to be checked about last coupon code.

  return <div className="inline-flex items-center w-auto gap-3"></div>;
};

export default ActionButtons;
