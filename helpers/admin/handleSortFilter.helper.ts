const handleSortFilter = (sort: string): any => {
  let sortOptions: any = {};

  if (!sort) {
    sort = "position-desc";
    sortOptions = {
      position: "desc",
    };
  } else {
    const sortArr = sort.split("-");
    const sortValue = sortArr[0];
    const sortType = sortArr[1];

    sortOptions = {
      [sortValue]: sortType,
    };
  }

  const sortFilter = {
    sortOptions: sortOptions,
    sort: sort,
  };

  return sortFilter;
};

export default handleSortFilter;
