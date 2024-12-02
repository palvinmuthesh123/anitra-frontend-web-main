import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, TableCell, TableRow } from "@mui/material";
import { Colors } from "../../constants/Colors";
import Card from "../../components/Card";
import CustomTable from "../../components/Table";
import CustomButton from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api-request";
import ACEFilter from "./ace-filter";
import Pagination from "../../components/Pagination";
import CustomDialog from "../../components/ConfirmationModal";
import { downloadFile } from "../../utilities/exportToCsv";

const Ace = () => {
  const navigate = useNavigate();

  const dashboardHeader = [
    {
      id: 1,
      title: "S.NO",
    },
    {
      id: 1,
      title: "VE ID",
    },
    {
      id: 2,
      title: "Name",
    },

    {
      id: 6,
      title: "Farmer",
    },
    {
      id: 7,
      title: "Trader",
    },
    {
      id: 8,
      title: "Animals",
    },
    {
      id: 9,
      title: "Villages",
    },
    {
      id: 10,
      title: "VE Address",
    },
    {
      id: 11,
      title: "Actions",
    },
  ];

  const [aceList, setAceList] = useState({
    data: [],
    totalCount: "",
  });
  const limit = 10;
  const [skip, setSkip] = useState(0);

  const [openAceRequestModal, setOpenAceRequestModal] = useState({
    data: {},
    open: false,
  });

  const [aceUsersCSV, setAceUsersCSV] = useState({
    data: [],
    loader: false,
  });

  const [filters, setFilters] = useState({
    search: "",
    state: "",
    district: "",
    mandal: "",
    village: "",
    hamlet: "",
  });

  useEffect(() => {
    getACEList(filters);
  }, [skip, filters]);

  const getACEList = (filters) => {
    const payload = {
      ...(filters?.state && {
        state_id: filters?.state && Number(filters?.state),
      }),
      ...(filters?.district && {
        district_id: filters?.district && Number(filters?.district),
      }),
      ...(filters?.mandal && {
        mandal_id: filters?.mandal && Number(filters?.mandal),
      }),
      ...(filters?.village && {
        village_id: filters?.village && Number(filters?.village),
      }),
      ...(filters?.hamlet && {
        hamlet_id: filters?.hamlet && Number(filters?.hamlet),
      }),
      ...(filters.search && {
        searchText: filters.search,
      }),
      skip: skip,
      limit: limit,
      sort_field: "_id",
      sort_order: "desc",
      search_fields: ["name", "mobile", "user_id"],
    };
    apiRequest({
      url: `ace/list`,
      data: payload,
      method: "POST",
    })
      .then((res) => {
        const aceResponse = res?.data?.map((ace) => ({
          id: ace?.user_id,
          name: ace?.name,
          mobile: ace?.mobile,
          svName: "NA",
          svMobile: "NA",
          farmer: ace?.user_count?.farmers ?? 0,
          trader: ace?.user_count?.traders ?? 0,
          animals:
            ace?.animal_count?.individual + ace?.animal_count?.flock_animals,
          villages: ace?.controlling_villages?.length ?? 0,
          location1: `${ace?.village_name ? ace.village_name + "," : ""}${
            ace?.hamlet_name ? ace.hamlet_name + "," : ""
          }${ace?.mandal_name ? ace.mandal_name + "," : ""}`,
          location2: `${ace?.district_name ? ace.district_name + "," : ""}${
            ace?.state_name ? ace.state_name + "," : ""
          }${ace?.pincode || ""}`,
          status: ace?.status,
        }));
        setAceList({ data: aceResponse, totalCount: res?.total_count });
      })
      .catch((err) => {
        alert(err);
      });
  };
  const handlePageChange = (pageNumber) => {
    const newSkip = (pageNumber - 1) * limit;
    setSkip(newSkip);
  };

  const TableDataUi = () => {
    return aceList?.data?.map((row, index) => (
      <TableRow
        key={row.id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {skip + index + 1}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              navigate(`/ace/${row?.id}/details/basic`);
            }}
          >
            {row?.id}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row?.name}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row?.mobile}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              navigate(`/ace/${row?.id}/details/farmers`);
            }}
          >
            {row?.farmer}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              navigate(`/ace/${row?.id}/details/traders`);
            }}
          >
            {row?.trader}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              navigate(`/ace/${row?.id}/details/animals`);
            }}
          >
            {row?.animals}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            fontFamily={"Poppins-Medium"}
            color={Colors.headerColor}
            fontSize={13}
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              navigate(`/ace/${row?.id}/details/villages`);
            }}
          >
            {row?.villages}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row?.location1}
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            color={Colors.textColor}
            fontSize={12}
          >
            {row?.location2}
          </Typography>
        </TableCell>
        <TableCell
          onClick={() => {
            if (row?.status === "ACCEPTED") {
              setOpenAceRequestModal({ data: row, open: false });
            } else {
              setOpenAceRequestModal({ data: row, open: true });
            }
          }}
          sx={{ cursor: "pointer" }}
        >
          <Box
            padding={"2px 8px"}
            textAlign={"center"}
            borderRadius={"12px"}
            border={"1px solid #B1040E"}
            bgcolor={row?.status === "ACCEPTED" ? "#B1040E" : "#fff"}
          >
            <Typography
              fontFamily={"Poppins-Regular"}
              fontSize={"12px"}
              color={row?.status === "ACCEPTED" ? "#fff" : "#B1040E"}
              bgcolor={row?.status === "ACCEPTED" ? "#B1040E" : "#fff"}
            >
              {row?.status === "ACCEPTED" ? "Accepted" : "Accept"}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    ));
  };

  const acceptAceRequest = () => {
    const payload = {
      status: "ACCEPTED",
      ace_id: openAceRequestModal.data?.id,
    };

    apiRequest({
      url: `admin/update-ace-status`,
      data: payload,
      method: "PUT",
    })
      .then((res) => {
        alert("Success");
        getACEList(filters);
        setOpenAceRequestModal({
          data: {},
          open: false,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    let headers = ["Id,Name,Mobile,Farmer,Trader,Animals,Villages,Ve Address"];

    let aceCSV;
    if (Array.isArray(aceUsersCSV.data) && aceUsersCSV.data.length > 0) {
      aceCSV = aceUsersCSV.data?.reduce((acc, user, index) => {
        const { user_id, animal_count, user_count, controlling_villages } =
          user;

        const aceId = user_id ?? "NA";

        const requestedName = user?.name;
        const mobile = user?.mobile;

        const userLocation = `"${user?.state_name}-${user?.district_name}-${
          user?.mandal_name
        }-${user?.village_name}-${user?.address
          .replace(/[\r\n]+/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/\s+/g, " ")}"${user?.pincode}`;

        const animalCount =
          animal_count?.flock_animals +
          animal_count?.flocks +
          animal_count?.individual;

        const farmerCount = user_count?.farmers ?? "NA";
        const traderCount = user_count?.traders ?? "NA";
        const villagesCount = controlling_villages?.length
          ? controlling_villages?.length
          : "NA";

        acc.push(
          [
            aceId,
            requestedName,
            mobile,
            farmerCount,
            traderCount,
            animalCount,
            villagesCount,
            userLocation,
          ].join(",")
        );
        return acc;
      }, []);

      downloadFile({
        data: [...headers, ...aceCSV].join("\n"),
        fileName: "Ace List.csv",
        fileType: "text/csv",
      });
    }
  }, [aceUsersCSV]);

  const exportCSV = () => {
    apiRequest({
      url: `ace/list`,
      method: "POST",
      data: { skip: 0, limit: 10000000 },
    })
      .then((res) => {
        setAceUsersCSV({ data: res?.data, totalCount: res?.total_count });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Box>
      <CustomDialog
        open={openAceRequestModal.open}
        onClose={() => setOpenAceRequestModal({ open: false })}
        width={"450px"}
        title={"VE Status Confirmation"}
      >
        <Box>
          <Typography fontSize={"14px"} fontFamily={"poppins"}>
            Are you sure you want to Accept this VE?
          </Typography>

          <Box
            display={"flex"}
            alignItems={"end"}
            justifyContent={"flex-end"}
            width={"100%"}
            mt={2}
            gap={"12px"}
          >
            <Box width={"25%"}>
              <CustomButton
                variant={"outlined"}
                title={`No`}
                handleButtonClick={() =>
                  setOpenAceRequestModal({ open: false })
                }
                backgroundColor={Colors.white}
                textColor={Colors.headerColor}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
              />
            </Box>
            <Box width={"25%"}>
              <CustomButton
                title={`Yes`}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                width={"100%"}
                height={34}
                borderColor={Colors.headerColor}
                textFontSize={14}
                handleButtonClick={acceptAceRequest}
              />
            </Box>
          </Box>
        </Box>
      </CustomDialog>

      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <Typography
            fontFamily={"Poppins-Medium"}
            fontSize={20}
            color={Colors.textColor}
          >
            Anitra Cluster Entrepreneur's List
          </Typography>
          <Typography
            fontFamily={"Poppins-Regular"}
            fontSize={13}
            color={Colors.textColor}
          ></Typography>
        </Grid>
        <Grid item>
          <Grid container gap={2} alignItems={"center"}>
            <Grid item sx={{ cursor: "pointer" }}>
              <CustomButton
                title={"Export"}
                handleButtonClick={exportCSV}
                backgroundColor={Colors.headerColor}
                textColor={Colors.white}
                width={130}
                height={34}
                textFontSize={14}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Card>
          <ACEFilter setFilters={setFilters} filters={filters} />
          <Box mt={2}>
            <CustomTable headerData={dashboardHeader} tableData={aceList}>
              <TableDataUi />
            </CustomTable>
            <Box mt={2} display={"flex"} justifyContent={"right"}>
              {aceList?.totalCount > 5 && (
                <Pagination
                  totalCount={Number(aceList?.totalCount)}
                  skip={skip}
                  limit={limit}
                  onPageChange={handlePageChange}
                />
              )}
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Ace;
