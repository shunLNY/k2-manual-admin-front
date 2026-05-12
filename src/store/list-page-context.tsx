/** @format */
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from 'react';
import { isLaptopView, isMobileView } from '@/utils/helpers';

type MultipleCopy = {
  isTermCopy?: boolean;
  isConstructionTypeCopy?: boolean;
  isUnitPriceCopy?: boolean;
  isEstimateCopy?: boolean;
  isBusinessPartnerCopy?: boolean;
  isCustomerCopy?: boolean;
};

type NewCreate = {
  isTermCreate?: boolean;
  isConstructionTypeCreate?: boolean;
  isUnitPriceCreate?: boolean;
  isCustomerCreate?: boolean;
  isBusinessPartnerCreate?: boolean;
};

interface BreadCrumbTitle {
  constructionBreadCrumb?: string;
  invoiceBreadCrumb?: string;
  estimateBreadCrumb?: string;
  unitPriceBreadCrumb?: string;
  termBreadCrumb?: string;
  customerBreadCrumb?: string;
  businessPartnerBreadCrumb?: string;
  constructionTypeBreadCrumb?: string;
}

type constructionData = {
  customerId: string;
  projectName: string;
  constructionCode: string;
} | null;

type PageContextData = {
  showSearchForm: boolean;
  toggleSearchForm: () => void;
  showSpFilter: boolean;
  toggleSpFilter: () => void;
  entryMode: 'new' | 'edit' | 'preview';
  setEntryMode: Dispatch<SetStateAction<'new' | 'edit' | 'preview'>>;
  openEditForm: boolean;
  setOpenEditForm: Dispatch<SetStateAction<boolean>>;
  clearFilter: () => void;
  headerTitle: string;
  setHeaderTitle: Dispatch<SetStateAction<string>>;
  listFilter: string;
  setListFilter: Dispatch<SetStateAction<string>>;
  openFilterModal: boolean;
  setOpenFilterModal: Dispatch<SetStateAction<boolean>>;
  isOpenMultipleCostModal: boolean;
  setIsOpenMultipleCostModal: Dispatch<SetStateAction<boolean>>;
  showCostMultipleButton: boolean;
  setShowCostMultipleButton: Dispatch<SetStateAction<boolean>>;
  showConstructionCreate: boolean;
  setShowConstructionCreate: Dispatch<SetStateAction<boolean>>;
  showSaveButton: boolean;
  setShowSaveButton: Dispatch<SetStateAction<boolean>>;
  isMultipleCopy: MultipleCopy;
  setIsMultipleCopy: Dispatch<SetStateAction<MultipleCopy>>;
  openTermEntryModal: boolean;
  setOpenTermEntryModal: Dispatch<SetStateAction<boolean>>;
  openConstructionTypeEntryModal: boolean;
  setOpenConstructionTypeEntryModal: Dispatch<SetStateAction<boolean>>;
  openUnitPriceEntryPage: boolean;
  setOpenUnitPriceEntryPage: Dispatch<SetStateAction<boolean>>;
  openBusinessPartnerEntryPage: boolean;
  setOpenBusinessPartnerEntryPage: Dispatch<SetStateAction<boolean>>;
  openCustomerEntryPage: boolean;
  setOpenCustomerEntryPage: Dispatch<SetStateAction<boolean>>;
  isNewCreate: NewCreate;
  setIsNewCreate: Dispatch<SetStateAction<NewCreate>>;
  breadCrumbTitle: string;
  setBreadCrumbTitle: Dispatch<string>;
  constructionData: constructionData | null; // Allow it to be null
  setConstructionData: Dispatch<SetStateAction<constructionData | null>>;
  companyRoundingMethod: Record<string, string>;
};

const ListPageContext = createContext<PageContextData | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function ListPageContextProvider({ children }: Props) {
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onResize = () => {
    setIsMobileScreen(isLaptopView(window.innerWidth));
  };

  const [showSearchForm, setShowSearchForm] = useState(false);

  const toggleSearchForm = () => {
    setShowSearchForm(!showSearchForm);
  };

  const [showSpFilter, setShowSpFilter] = useState(false);
  const toggleSpFilter = () => {
    setShowSpFilter(!showSpFilter);
  };

  const [entryMode, setEntryMode] = useState<'new' | 'edit' | 'preview'>('new');
  const [headerTitle, setHeaderTitle] = useState('');
  const [listFilter, setListFilter] = useState('');
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [isOpenMultipleCostModal, setIsOpenMultipleCostModal] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [showCostMultipleButton, setShowCostMultipleButton] = useState(false);
  const [showConstructionCreate, setShowConstructionCreate] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [constructionData, setConstructionData] =
    useState<constructionData>(null);
  // Multiple Copy and delete
  const [isMultipleCopy, setIsMultipleCopy] = useState<MultipleCopy>({
    isTermCopy: true,
    isConstructionTypeCopy: true,
    isUnitPriceCopy: true,
    isEstimateCopy: true,
    isBusinessPartnerCopy: true,
    isCustomerCopy: true,
  });
  const [isNewCreate, setIsNewCreate] = useState<NewCreate>({
    isTermCreate: true,
    isConstructionTypeCreate: true,
    isUnitPriceCreate: true,
    isBusinessPartnerCreate: true,
    isCustomerCreate: true,
  });
  const [openTermEntryModal, setOpenTermEntryModal] = useState(false);
  const [openConstructionTypeEntryModal, setOpenConstructionTypeEntryModal] =
    useState(false);
  const [openUnitPriceEntryPage, setOpenUnitPriceEntryPage] = useState(false);
  const [openBusinessPartnerEntryPage, setOpenBusinessPartnerEntryPage] =
    useState(false);
  const [openCustomerEntryPage, setOpenCustomerEntryPage] = useState(false);

  // list searching & filter form
  // const [keyword, setKeyword] = useState('');
  const [queryParams, setQueryParams] = useState<Record<string, string | string[]>>({});

  // clear query params
  const [isSubmitClear, setIsSubmitClear] = useState(true);

  // Dynamic Header title
  const [breadCrumbTitle, setBreadCrumbTitle] = useState('');

  // Getting Rounding Method
  const [urlRoundingMethodPath, setUrlRoundingMethodPath] =
    useState<URL | null>(null);
  const [companyRoundingMethod, setCompanyRoundingMethod] = useState<
    Record<string, string>
  >({});

  const clearFilter = () => {
    setIsSubmitClear(true);
  };

  useEffect(() => {
    if (isSubmitClear) {
      setQueryParams({});
    }
  }, [isSubmitClear]);

  useEffect(() => {
    setUrlRoundingMethodPath(
      new URL(
        window.location.origin + '/api/proxy/my-company/company-rounding-method'
      )
    );
  }, []);

  const context = {
    data: [],
    showSearchForm,
    toggleSearchForm,
    showSpFilter,
    toggleSpFilter,
    entryMode,
    setEntryMode,
    openEditForm,
    setOpenEditForm,
    clearFilter,
    headerTitle,
    setHeaderTitle,
    listFilter,
    setListFilter,
    openFilterModal,
    setOpenFilterModal,
    isOpenMultipleCostModal,
    setIsOpenMultipleCostModal,
    showCostMultipleButton,
    setShowCostMultipleButton,
    showConstructionCreate,
    setShowConstructionCreate,
    showSaveButton,
    setShowSaveButton,
    isMultipleCopy,
    setIsMultipleCopy,
    openTermEntryModal,
    setOpenTermEntryModal,
    openConstructionTypeEntryModal,
    setOpenConstructionTypeEntryModal,
    openUnitPriceEntryPage,
    setOpenUnitPriceEntryPage,
    openBusinessPartnerEntryPage,
    setOpenBusinessPartnerEntryPage,
    openCustomerEntryPage,
    setOpenCustomerEntryPage,
    isNewCreate,
    setIsNewCreate,
    breadCrumbTitle,
    setBreadCrumbTitle,
    constructionData: constructionData || null,
    setConstructionData,
    companyRoundingMethod,
  };

  return (
    <ListPageContext.Provider value={context}>
      {children}
    </ListPageContext.Provider>
  );
}

export const useListPage = () => {
  const context = useContext(ListPageContext);
  if (context === undefined) {
    throw new Error('useListPage must be used within a ListPageContextProvider');
  }
  return context;
};

export default ListPageContext;
