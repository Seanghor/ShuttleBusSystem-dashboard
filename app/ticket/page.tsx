"use client";
import { useEffect, useState } from "react";

import { getAllBatch } from "@/services/auth/batch-api";
import { getAllUser } from "@/services/auth/user-api";
import {
  refillAllUser,
  refillAllUserModel,
  refillParticularUser,
  refillParticularUserModel,
} from "@/services/auth/ticket-api";

import { TreeSelect } from "antd";
import { SubmitButton } from "@/components/submit_button";

const fetchData = async (setBatch: Function) => {
  const responseData = await getAllBatch();
  const data = responseData.data.sort(
    (a: any, b: any) =>
      a.department.localeCompare(b.department) || a.batchNum - b.batchNum
  );
  setBatch(
    data.map((item: any) => {
      return {
        value: `${item?.department}-${item?.batchNum}`,
        title: `${
          item?.department == "SOFTWAREENGINEERING"
            ? "SE"
            : item?.department === "TOURISMANDMANAGEMENT"
            ? "TM"
            : item?.department === "ARCHITECTURE"
            ? "ARC"
            : "N/A"
        }-B${item?.batchNum}`,
      };
    })
  );
  // setBatch(data);
  return data;
};

const fetchUser = async (setPartUser: Function, setUserList: Function) => {
  const responseData = await getAllUser();
  const data = responseData.data.filter((item: any) => item.role != "ADMIN");
  setPartUser(
    data.map((item: any) => {
      return {
        value: item.id,
        title: item.username,
      };
    })
  );

  setUserList(data);
  return data;
};

const TicketManagement = () => {
  const [ticketType, setTicketType] = useState("");
  const [amount, setAmount] = useState(0);
  const [include, setInclude] = useState(false);
  const [batch, setBatch] = useState<any[]>([]);
  const [type, setType] = useState("");
  const [batchNum, setBatchNum] = useState(0);
  const [userList = [], setUserList] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState<any[]>([]);
  const [partUser, setPartUser] = useState<any[]>([]);
  const [department, setDepartment] = useState("");


  useEffect(() => {
    userList.length == 0 ? fetchUser(setPartUser, setUserList) : null;
    batch.length == 0 ? fetchData(setBatch) : null;
  }, [batch.length, userList.length]);

  const treeData = [
    {
      value: "ALL",
      title: "ALL",
    },
    {
      value: "STAFF",
      title: "STAFF",
    },
    {
      value: "BATCH",
      title: "BATCH",
      children: batch,
    },
  ];

  const handleChange = (event: { target: { value: string } }) => {
    const result = event.target.value.replace(/\D/g, "");
    setAmount(Number(result));
  };

  const resetForm = () => {
    setTicketType("");
    setAmount(0);
    setInclude(false);
    setType("");
    setBatchNum(0);
    setSearchUser([]);
  }

  const handleSummit = async (event: { target: { value: string } }) => {
    if (ticketType == "all") {
      const dataRefill = {
        amount: amount,
        include: include,
        type: type,
        batchNum: batchNum,
        department: department,
      } as refillAllUserModel;
      const res = await refillAllUser(dataRefill);
      const data = await res.json();
      if (res.status == 200) {
        console.log("Success");
        resetForm();
      } else {
        console.log("Something went wrong");
        resetForm();
      }
    } else if (ticketType == "particular") {
      const dataRefill = {
        amount: amount,
        include: include,
        listUser: searchUser,
      } as refillParticularUserModel;
      const res = await refillParticularUser(dataRefill);
      const data = await res.json();
      if (res.status == 200) {
        console.log("Success");
        resetForm();
      } else {
        console.log("Something went wrong");
        resetForm();
      }
    }
  };

  //default value
  const [defaultValue, setDefaultValue] = useState<any[]>([]);

  return (
    <div className="px-5 pt-12 bg-[#e7f0ea]">
      <div>
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl mt-5">Ticket Management</h1>
          <div className="flex items-center justify-center h-[69vh] mt-[50px]">
            <div className="w-1/2 rounded-lg bg-[#dbe8e0] p-[30px] sm:w-[580px]">
              {/* title */}
              <h1 className="mt-[10px] text-[24px] font-normal">
                Refill Tickets Form
              </h1>
              <h4 className="mt-[40px] mb-[40px] text-[13px] font-normal">
                Select one of the option above
              </h4>
              {/* option button */}
              <div className="flex flex-row justify-between">
                <div
                  className="flex flex-row p-2 cursor-pointer"
                  onClick={() => {
                    setTicketType("all");
                    setDefaultValue([]);
                  }}
                >
                  <div
                    className={`w-[25px] h-[25px] rounded-full  mr-2 ${
                      ticketType == "all"
                        ? "bg-[#0e6431]"
                        : "bg-[#ffff] border border-black-normal"
                    }`}
                  ></div>
                  <div className="flex items-center ">
                    <p className="text-[13px] font-normal">
                      Refill for all users
                    </p>
                  </div>
                </div>
                <div
                  className="flex flex-row p-2 cursor-pointer"
                  onClick={() => {
                    setTicketType("particular");
                    setDefaultValue([]);
                  }}
                >
                  <div
                    className={`w-[25px] h-[25px] rounded-full border border-black-normal mr-2 ${
                      ticketType == "particular"
                        ? "bg-[#0e6431]"
                        : "bg-[#ffff] border border-black-normal"
                    }`}
                  ></div>
                  <div className="flex items-center ">
                    <p className="text-[13px] font-normal">
                      Refill for particular users
                    </p>
                  </div>
                </div>
              </div>
              {/* content */}
              {ticketType == "all" ? (
                <div className="">
                  <h1 className="mt-5 mb-5 text-sm sm:text-base">
                    Refill for all users
                  </h1>
                  <div className="flex flex-col justify-between mt-5 mb-5 sm:flex-row">
                    <div className="flex flex-col">
                      <label
                        htmlFor="filter-by"
                        className="text-sm sm:text-base"
                      >
                        Filter by
                      </label>

                      <TreeSelect
                        disabled={false}
                        treeData={treeData}
                        onChange={(value: any) => {
                          const data = value.split("-");

                          if (data.length > 1) {
                            setDepartment(data[0]);
                            setBatchNum(Number(data[1]));
                            setType("BATCH");
                          } else {
                            setType(data[0]);
                            setBatchNum(0);
                          }
                        }}
                        style={{ width: "200px" }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: "auto",
                          width: "200px",
                        }}
                        popupClassName="w-[200px]"
                        allowClear
                        popupMatchSelectWidth={true}
                        showCheckedStrategy={TreeSelect.SHOW_PARENT} // Show checkboxes for parents if any child is selected
                        placeholder="Please select"
                      />
                    </div>
                    <div className="flex flex-col mt-5 sm:mt-0 sm:ml-4">
                      <label htmlFor="tickets" className="text-sm sm:text-base">
                        Tickets
                      </label>
                      <input
                        type="text"
                        id="tickets"
                        placeholder="Tickets"
                        min={0}
                        value={amount}
                        onChange={handleChange}
                        className="p-2 mt-2 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row items-center mt-5 mb-5">
                    <input
                      type="checkbox"
                      id="include-tickets"
                      className="w-5 h-5 mr-2"
                      onChange={(e) => setInclude(e.target.checked)}
                    />
                    <label
                      htmlFor="include-tickets"
                      className="text-sm sm:text-base"
                    >
                      Include current tickets
                    </label>
                  </div>
                </div>
              ) : ticketType == "particular" ? (
                <div className="">
                  <h1 className="mt-5 mb-5 text-sm sm:text-base">
                    Refill for particular users
                  </h1>
                  <div className="flex flex-col justify-between mt-5 mb-5 sm:flex-row">
                    <div className="flex flex-col">
                      <label
                        htmlFor="username"
                        className="text-sm sm:text-base"
                      >
                        Username
                      </label>

                      {
                        <TreeSelect
                          onChange={(value: any) => {
                            setSearchUser(value);
                            setDefaultValue(value);
                          }}
                          showSearch={true}
                          style={{ width: "200px" }}
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: "auto",
                            width: "200px",
                          }}
                          defaultValue={defaultValue}
                          value={defaultValue}
                          popupClassName="w-[200px]"
                          allowClear
                          popupMatchSelectWidth={true}
                          showCheckedStrategy={TreeSelect.SHOW_PARENT} // Show checkboxes for parents if any child is selected
                          placeholder="Please select"
                          treeData={partUser}
                          treeCheckable={true}
                          treeNodeFilterProp="title"
                        />
                      }
                    </div>
                    <div className="flex flex-col mt-5 sm:mt-0 sm:ml-4">
                      <label htmlFor="tickets" className="text-sm sm:text-base">
                        Tickets
                      </label>
                      <input
                        type="text"
                        id="tickets"
                        placeholder="Tickets"
                        min={0}
                        value={amount}
                        onChange={handleChange}
                        className="flex p-2 mt-2 rounded-lg outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row items-center mt-5 mb-5 ">
                    <input
                      type="checkbox"
                      id="include-tickets"
                      className="w-5 h-5 mr-2 "
                      onChange={(e) => setInclude(e.target.checked)}
                    />
                    <label
                      htmlFor="include-tickets"
                      className="text-sm sm:text-base"
                    >
                      Include current tickets
                    </label>
                  </div>
                </div>
              ) : null}
              {/* summit button */}
              <div className="flex">
                <SubmitButton
                  title={"Refill"}
                  onClick={handleSummit}
                  isDisabled={
                    ticketType == "all" &&
                    (type == "STAFF" || type == "ALL" || type == "BATCH")
                      ? false
                      : type == "BATCH" && batchNum >= 0 && department != ""
                      ? false
                      : ticketType === "particular" && searchUser.length !== 0
                      ? false
                      : true
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketManagement;
