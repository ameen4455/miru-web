import React, { Fragment, useEffect, useState } from "react";

import teamApi from "apis/team";
import withLayout from "common/Mobile/HOC/withLayout";
import Pagination from "common/Pagination/Pagination";
import { TeamModalType } from "constants/index";
import { ListContext } from "context/TeamContext";
import { useUserContext } from "context/UserContext";
import { unmapList, unmapPagyData } from "mapper/team.mapper";

import Header from "./Header";
import Table from "./Table";

import Modals from "../modals/Modals";

const TeamList = () => {
  const [teamList, setTeamList] = useState([]);
  const [modal, setModal] = useState("");
  const [modalUser, setModalUser] = useState({});
  const [pagy, setPagy] = useState<any>(null);

  const { isDesktop } = useUserContext();

  const hideContainer = modal == TeamModalType.ADD_EDIT && !isDesktop;

  const setModalState = (modalName, user = {}) => {
    setModalUser(user);
    setModal(modalName);
  };

  const getTeamList = async () => {
    const response = await teamApi.get();
    if (response.status === 200) {
      const sanitized = unmapList(response);
      const pagyData = unmapPagyData(response);
      setTeamList(sanitized);
      setPagy(pagyData);
    }
  };

  useEffect(() => {
    if (modal == TeamModalType.NONE) {
      getTeamList();
    }
  }, [modal]);

  const handlePageChange = async (pageData, items = pagy.items) => {
    if (pageData == "...") return;

    const response = await teamApi.get(`page=${pageData}&items=${items}`);
    if (response.status === 200) {
      const sanitized = unmapList(response);
      const pagyData = unmapPagyData(response);
      setTeamList(sanitized);
      setPagy(pagyData);
    }
  };

  const TeamLayout = () => (
    <ListContext.Provider
      value={{
        teamList,
        setModalState,
        modal,
      }}
    >
      {!hideContainer && (
        <Fragment>
          <Header />
          <div>
            <div className="table__flex pb-14">
              <div className="table__border border-b-0 border-miru-gray-200">
                <Table />
              </div>
            </div>
            <Pagination
              isTeamPage
              handleClick={handlePageChange}
              pagy={pagy}
              params={pagy}
              setParams={setPagy}
              title="users/page"
            />
          </div>
        </Fragment>
      )}
      <Modals user={modalUser} />
    </ListContext.Provider>
  );

  const Main = withLayout(TeamLayout, !hideContainer, !hideContainer);

  return isDesktop ? TeamLayout() : <Main />;
};

export default TeamList;
