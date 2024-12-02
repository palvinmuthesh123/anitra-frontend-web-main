import { Box, Button } from "@mui/material";

const Pagination = ({ totalCount, skip, limit, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.floor(skip / limit) + 1;
  const maxPageButtons = 10; // Maximum number of page buttons to display

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const handlePrevPage = () => {
    if (skip > 0) {
      const prevSkip = skip - limit;
      onPageChange(Math.floor(prevSkip / limit) + 1);
    }
  };

  const handleNextPage = () => {
    if (skip + limit < totalCount) {
      const nextSkip = skip + limit;
      onPageChange(Math.floor(nextSkip / limit) + 1);
    }
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    if (totalPages > maxPageButtons && endPage === totalPages) {
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      const styles = {
        color: skip === (page - 1) * limit ? "#B1040E" : "#111A45",
        backgroundColor: skip === (page - 1) * limit ? "#DC8D91" : "#E1E1E1",
      };
      pageButtons.push(
        <Button
          sx={{
            fontFamily: "poppins",
            fontSize: "12px",
            padding: "0px",
            minWidth: "0px",
            padding: "5px 15px",
          }}
          style={styles}
          key={page}
          onClick={() => handlePageChange(page)}>
          {page}
        </Button>
      );
    }

    return pageButtons;
  };

  return (
    <Box>
      <Box spacing={2} display={"flex"} gap={"10px"}>
        <Button
          onClick={handlePrevPage}
          disabled={skip === 0}
          sx={{
            fontFamily: "poppins",
            fontSize: "12px",
            color: "#111A45 !important",
            padding: "5px 10px",
            minWidth: "0px",
            cursor: "pointer",
            backgroundColor: "#E1E1E1",
            textTransform: "none",
          }}>
          Prev
        </Button>
        {renderPageButtons()}
        <Button
          onClick={handleNextPage}
          disabled={skip + limit >= totalCount}
          sx={{
            fontFamily: "poppins",
            fontSize: "12px",
            color: "#111A45",
            padding: "5px 10px",
            minWidth: "0px",
            cursor: "pointer",
            backgroundColor: "#E1E1E1",
            textTransform: "none",
          }}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Pagination;
