import React from "react";

import { Avatar } from "StyledComponents";

const TableRow = ({ leave, key }) => {
  const {
    leaveType,
    leaveIcon,
    leaveColor,
    total,
    countType,
    repetitionType,
    carryForwardDays,
  } = leave;

  return (
    <tr className="flex w-full" key={key}>
      <td className="flex w-4/12 cursor-pointer items-center border-b border-miru-gray-400 py-6 pr-2">
        <Avatar
          classNameImg="mr-2 p-2"
          style={{ backgroundColor: leaveColor.value }}
          url={leaveIcon.icon}
        />
        <span className="text-left text-sm font-medium text-miru-dark-purple-1000">
          {leaveType}
        </span>
      </td>
      <td
        className="flex w-4/12 items-center border-b border-miru-gray-400 py-6 pr-2 text-left text-sm font-medium text-miru-dark-purple-1000"
        scope="col"
      >
        {total} {countType} {repetitionType}
      </td>
      <td
        className="flex w-4/12 items-center border-b border-miru-gray-400 py-6 pr-2 text-left text-sm font-medium text-miru-dark-purple-1000"
        scope="col"
      >
        {carryForwardDays} days
      </td>
    </tr>
  );
};

export default TableRow;
