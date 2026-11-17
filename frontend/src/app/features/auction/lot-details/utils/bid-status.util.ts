import { BidStatusType, LotDetails, LotStatus } from '../../../../core/models/lot.model';
import { KycStatus, User } from '../../../../core/models/auth.model';
import { LotHold } from '../../../../core/models/finance.model';

const BID_STATUS_CONFIG: Readonly<Record<Exclude<LotStatus, 'active'>, BidStatusType>> = {
  upcoming: 'awaiting_start',
  finished: 'awaiting_payment',
  sold: 'deal_closed',
  cancelled: 'auction_cancelled',
};

const KYC_STATUS_CONFIG: Readonly<Record<Exclude<KycStatus, 'approved'>, BidStatusType>> = {
  none: 'kyc_required',
  rejected: 'kyc_required',
  pending: 'kyc_pending',
};

export function resolveBidStatus(
  lot: LotDetails,
  user: User | null,
  holds: readonly LotHold[],
): BidStatusType {
  const status = lot.status;
  if (status !== 'active') {
    return BID_STATUS_CONFIG[status];
  }

  if (!user) {
    return 'auth_required';
  }
  if (!user.isPhoneVerified || !user.isEmailVerified) {
    return 'contacts_unverified';
  }
  if (user.kycStatus !== 'approved') {
    return KYC_STATUS_CONFIG[user.kycStatus];
  }

  if (
    !holds.some(
      (hold) => hold.lotId === lot.id && hold.userId === user.id && hold.status === 'pre_auth',
    )
  ) {
    return 'deposit_required';
  }

  const bids = lot.bids;
  if (!bids.some((bid) => bid.userId === user.id)) {
    return 'no_bids';
  }
  if (bids[0].userId === user.id) {
    return 'leading';
  }
  return 'outbid';
}
