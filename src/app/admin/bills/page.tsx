"use client";
import React, { JSX, Suspense, useCallback, useEffect, useState } from "react";
import Layout from "../../components/Organisms/layout/Layout";
import Text3xl from "../../components/Atoms/text/Text3xl";
import PrimaryButton from "../../components/Atoms/buttons/PrimaryButton";
import { AddIcon } from "../../components/svg/AddIcon";
import TableLoading from "../../components/Organisms/loaders/TableLoading";
import dynamic from "next/dynamic";
import { Column, TableProps } from "../../components/Organisms/table/type";
import SearchInput from "../../components/Atoms/input/SearchInput";
import ModalForm from "../../components/Organisms/modal/ModalForm";
import BillAddEditFormContent from "./BillAddEditFormContent";
import { AddEditBillFormData, Bill } from "../../../lib/admin/api/bills/types";
import { useConfirmDeleteModal } from "../../utils/providers/ConfirmDeleteModalProvider";
import { useToastContext } from "../../utils/providers/ToastProvider";
import { createBill, fetchBills } from "../../../lib/admin/api/bills/bills";

//---Start---Note: Use `dynamic`(Next Js for Lazy Loading) for components fetching data. This is for optimization
const BillsTable = dynamic(
  () => import("../../components/Organisms/table/Table"),
  {
    loading: () => <TableLoading />,
    ssr: false,
  }
) as <T>(props: TableProps<T>) => JSX.Element;
//---End---Note: Use `dynamic`(Next Js for Lazy Loading) for components fetching data. This is for optimization

const Bills = () => {
  const [isViewAddEditBillModal, setIsViewAddEditBillModal] =
    useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [billsTableData, setBillsTableData] = useState<Bill[]>();

  const [billAddEditData, setBillAddEditData] = useState<AddEditBillFormData>({
    type_of_bill: "",
    lodger_id: "",
    past_reading_date: "",
    present_reading_date: "",
    present_reading: 0,
    past_reading: 0,
    current_bill: 0,
    monthly_given_bill: 0,
    add_on: 0,
    due_date: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10,
    total: 0,
  });

  const tableColumns: Column<Bill>[] = [
    { key: "bill_number", label: "Bill No." },
    { key: "room_number", label: "Room" },
    {
      key: "lodger_full_name",
      label: "Lodger Name",
    },
    { key: "due_date", label: "Due Date", type: "date" },
    { key: "type_of_bill", label: "Bill Type" },
    { key: "status", label: "Status", type: "status_select" },
    { key: "bill_amount", label: "Amount", type: "money", justify: "right" },
  ];

  const { confirmDeleteModal } = useConfirmDeleteModal();
  const { showToast } = useToastContext();

  const resetAddEditBillData = () => {
    setBillAddEditData({
      type_of_bill: "",
      lodger_id: "",
      past_reading_date: "",
      present_reading_date: "",
      present_reading: 0,
      past_reading: 0,
      current_bill: 0,
      monthly_given_bill: 0,
      add_on: 0,
      due_date: "",
    });
  };

  // ------------------ TABLE FUNCTIONS --------------------

  const fetchData = async () => {
    const { data, count } = await fetchBills(
      query,
      pagination.current,
      pagination.limit,
      "",
      "",
      ""
    );
    setBillsTableData(data);
    setPagination((prevState) => ({
      ...prevState,
      total: count,
    }));
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current]);

  const handleNextPagination = useCallback(() => {
    setPagination((prevState) => {
      const { total, limit, current } = prevState;
      const lastPage = Math.ceil(total / limit);
      return current < lastPage
        ? { ...prevState, current: current + 1 }
        : prevState;
    });
  }, []);

  const handlePrevPagination = useCallback(() => {
    setPagination((prevState) => ({
      ...prevState,
      current: Math.max(1, prevState.current - 1),
    }));
  }, []);

  const onSelectTablePage = useCallback((page: number) => {
    setPagination((prevState) => ({
      ...prevState,
      current: page,
    }));
  }, []);

  const onSearchTable = () => {};

  const onAddEditBill = () => {
    setIsViewAddEditBillModal(true);
  };

  const onCloseAddEditBillModal = () => {
    setIsViewAddEditBillModal(false);
    resetAddEditBillData();
  };

  const onSubmitAddEditBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      add_on,
      current_bill,
      due_date,
      lodger_id,
      monthly_given_bill,
      past_reading,
      present_reading,
      present_reading_date,
      past_reading_date,
      type_of_bill,
    } = billAddEditData;
    try {
      const result = await createBill(
        due_date,
        past_reading,
        present_reading,
        current_bill,
        monthly_given_bill,
        type_of_bill,
        add_on,
        present_reading_date,
        past_reading_date,
        lodger_id
      );

      if (result.success) {
        showToast("Bill added successfully!", "success");
        resetAddEditBillData();
        setIsViewAddEditBillModal(false);
        fetchData();
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message ||
        "An unexpected error occurred.";
      showToast(errorMessage, "danger");
    }
  };

  const onHandleChangeform = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setBillAddEditData({
      ...billAddEditData,
      [e.target.id]: e.target.value,
    });
  };

  const onChangeSelectStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // setBillAddEditData({
    //   ...billAddEditData,
    //   [e.target.id]: e.target.value,
    // });
    console.log("e.target.id:", e.target.id)
    console.log("e.target.value:",e.target.value)
  };

  return (
    <Layout>
      {/* -------------- Header Table--------------*/}
      <div className="flex w-full justify-between items-center mb-3">
        <Text3xl> Bills Management </Text3xl>
        <div className="lg:w-[150px]">
          <PrimaryButton onClick={onAddEditBill}>
            <AddIcon color="white" />
            Add Bills
          </PrimaryButton>
        </div>
      </div>
      {/* -------------- Header Table--------------*/}
      <SearchInput onChangeSearch={onSearchTable} />
      <Suspense fallback={<TableLoading />}>
        <BillsTable
          data={billsTableData ?? []}
          columns={tableColumns ?? []}
          handleNextNavigation={handlePrevPagination}
          handlePrevNavigation={handleNextPagination}
          onSelectTablePage={onSelectTablePage}
          pagination={pagination}
          onClickView={() => {}}
          onClickDelete={() => {}}
          onChangeSelectStatus={onChangeSelectStatus}
        />
      </Suspense>
      <ModalForm
        title={"Add Bill"}
        content={
          <BillAddEditFormContent
            handleChangeForm={onHandleChangeform}
            formData={billAddEditData}
          />
        }
        isOpen={isViewAddEditBillModal}
        onCloseModal={onCloseAddEditBillModal}
        onSubmitForm={onSubmitAddEditBill}
      />
    </Layout>
  );
};

export default Bills;
