import React, { useEffect, useState } from "react";

import { Country } from "country-state-city";
import { Outlet, useNavigate } from "react-router-dom";

import companiesApi from "apis/companies";
import Loader from "common/Loader/index";
import DetailsHeader from "components/Profile/DetailsHeader";
import { useUserContext } from "context/UserContext";
import { sendGAPageView } from "utils/googleAnalytics";

import MobileHeader from "./MobileHeader";
import StaticPage from "./StaticPage";

const initialState = {
  id: null,
  logoUrl: "",
  companyName: "",
  companyAddr: "",
  companyPhone: "",
  countryName: "",
  companyCurrency: "",
  companyRate: 0.0,
  companyFiscalYear: "",
  companyDateFormat: "",
  companyTimezone: "",
  logo: null,
};

const OrgDetails = () => {
  const navigate = useNavigate();
  const { isDesktop } = useUserContext();
  const [orgDetails, setOrgDetails] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    const res = await companiesApi.index();
    const companyDetails = { ...res.data.company_details };
    const {
      logo,
      name,
      address,
      business_phone,
      currency,
      standard_price,
      fiscal_year_end,
      date_format,
      timezone,
      id,
    } = companyDetails;

    const { address_line_1, address_line_2, city, state, pin, country } =
      address;

    const { name: CountryName } = country
      ? Country.getCountryByCode(country)
      : { name: "" };

    const companyAddrParts = [
      address_line_1,
      address_line_2,
      city,
      state,
      pin,
      CountryName,
    ];

    const companyAddr = companyAddrParts
      .filter(part => part !== null && part !== undefined && part !== "")
      .join(", ");

    setOrgDetails({
      logoUrl: logo,
      companyName: name,
      companyAddr,
      companyPhone: business_phone,
      countryName: address.country,
      companyCurrency: currency,
      companyRate: parseFloat(standard_price),
      companyFiscalYear: fiscal_year_end,
      companyDateFormat: date_format,
      companyTimezone: timezone,
      id,
      logo: null,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    sendGAPageView();
    getData();
  }, []);

  const handleEditClick = () => {
    navigate(`/profile/edit/organization`, { replace: true });
  };

  const handleBackBtnClick = () => {
    navigate(`/profile/edit/option`, { replace: true });
  };

  return (
    <div className="flex w-full flex-col">
      {isDesktop ? (
        <DetailsHeader
          showButtons
          editAction={handleEditClick}
          isDisableUpdateBtn={false}
          subTitle=""
          title="Organization Settings"
        />
      ) : (
        <MobileHeader
          title="Organization Settings"
          onBackArrowClick={handleBackBtnClick}
          onEditBtnClick={handleEditClick}
        />
      )}
      {isLoading ? (
        <div className="flex h-80v w-full flex-col justify-center">
          <Loader />
        </div>
      ) : (
        <StaticPage orgDetails={orgDetails} />
      )}
      <Outlet />
    </div>
  );
};

export default OrgDetails;
