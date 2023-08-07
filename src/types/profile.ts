import { IErrorType } from './error';
// ----------------------------------------------------------------------

export type IUserTableFilterValue = string | string[];

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type IUserTableFiltersAdmin = {
  name: string;
  role: string;
  status: string;
};

// ----------------------------------------------------------------------

export type IUserSocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: IUserSocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: Date | string | number;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: Date | string | number;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    message: string;
    createdAt: Date | string | number;
    author: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IUserItem = {
  id: string;
  name: string;
  city: string;
  role: string;
  email: string;
  state: string;
  status: string;
  address: string;
  country: string;
  zipCode: string;
  company: string;
  avatarUrl: string;
  phoneNumber: string;
  isVerified: boolean;
};

// export type IUserAccount = {
//   email: string;
//   isPublic: boolean;
//   displayName: string;
//   city: string | null;
//   state: string | null;
//   about: string | null;
//   country: string | null;
//   address: string | null;
//   zipCode: string | null;
//   phoneNumber: string | null;
//   photoURL: CustomFile | string | null;
// };

export type IUserAccount = {
  id: string;
  createdAt: Date | string;
  modifiedAt: Date | string;
  version: number;
  name: string;
  address: string;
  website: string | null;
  taxNumber: string;
  email: string;
  logo: string | null;
  invoiceReceivedEmail: string;
  engName: string | null;
  digitalSignatureDueDate: string | null;
  digitalSignaturePeriod: string | null;
  digitalSignatureRegisDate: string | null;
  representPersonName: string | null;
  declarationPeriod: string | null;
  needAudit: boolean | null;
  businessTypeId: number | null;
  domainBusinessId: number | null;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: Date | string | number;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type IProfileState = {
  profileData: IUserAccount;
  profileStatus: {
    loading: boolean;
    empty: boolean;
    error: IErrorType;
  };
};
