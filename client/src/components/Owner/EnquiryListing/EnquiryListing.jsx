import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SiGooglemessages } from "react-icons/si";
import { useCancelEnquiryMutation } from "../../../Redux/Slices/ownerApi/ownerApiSlice";
import { Button } from "@material-tailwind/react";
import { generateSuccess } from "../../Dependencies/toast";

const columns = [
  { id: "fullName", label: "Name", minWidth: 130 },
  { id: "email", label: "Email", minWidth: 100 },
  {
    id: "mobile",
    label: "Mobile",
    minWidth: 120,
  },
  {
    id: "tokenAmount",
    label: "Token Amount",
    minWidth: 130,

    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "interest", label: "Interest", minWidth: 100 },
  { id: "chat", label: "Chat with User", minWidth: 130 },
  { id: "manage", label: "Manage", minWidth: 100 },
];

export default function EnquiryListing({
  enquiriesLoading,
  enqiuries,
  ownerInfo,
  setEnquiries,
}) {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [useCancelEnquiryCall] = useCancelEnquiryMutation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCancel = async (e, id) => {
    e.preventDefault();
    try {
      const result = await useCancelEnquiryCall({
        id,
        owner: ownerInfo._id,
      }).unwrap();
      console.log(result);
      if (result.error) {
        generateError(result.error);
      } else {
        setEnquiries(result.enquiries);
        generateSuccess(result.message);
      }
    } catch (error) {
      console.log(error);
      generateError(error.message);
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={"center"}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {enquiriesLoading
              ? Array.from(Array(rowsPerPage), (_, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : (enqiuries || [])
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((enquiry, index) => (
                    <TableRow
                      key={enquiry?._id?.$oid || index}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      {columns.map((column) => {
                        const value = enquiry && enquiry[column.id];

                        // Custom rendering for the "Chat with User" column
                        if (column.id === "chat") {
                          return (
                            <TableCell key={column.id} align={"center"}>
                              <button
                                onClick={() =>
                                  navigate(`/owner/chat/${enquiry.user}`)
                                }
                              >
                                <SiGooglemessages size={32} />
                              </button>
                            </TableCell>
                          );
                        }

                        if (column.id === "manage") {
                          return (
                            <TableCell key={column.id} align={"center"}>
                              {enquiry.is_cancelled ? (
                                <p className="text-red-500">Cancelled</p>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={(e) => handleCancel(e, enquiry._id)}
                                  className="bg-black hover:bg-white hover:text-black hover:border"
                                >
                                  Cancel
                                </Button>
                              )}
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={column.id} align={"center"}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={(enqiuries || []).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
