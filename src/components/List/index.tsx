import classNames from "classnames";
import { useRef, useState, useEffect } from "react";
import LazyImg from "../LazyImg";
import Icon from "../Icon";
import { api } from "../../utils/index";
import loadingGif from "../../assets/loading.gif";

const Item = (props) => {
  const { index, data } = props;
  return (
    <div className="w-1/2 md:w-1/3 lg:w-1/4 p-2 transition-all">
      <div className="bg-gray-200">
        <h5 className="text-center py-4 leading-9">#{index}</h5>
        <LazyImg
          className="lazyload w-1/2 aspect-square mx-auto bg-cover bg-center"
          src={loadingGif}
          dataSrc={data.owner.avatar_url}
        />
        <h6 className="text-lg text-center text-red-700 text-nowrap text-ellipsis overflow-hidden">
          {data.name}
        </h6>
        <div className="p-8">
          <div className="text-nowrap text-ellipsis overflow-hidden">
            <Icon type="icon-user" className="text-yellow-500 mr-1" />
            <span>{data.name}</span>
          </div>
          <div className="text-nowrap text-ellipsis overflow-hidden">
            <Icon type="icon-star" className="text-yellow-400 mr-1" />
            <span>{data.stargazers_count} stars</span>
          </div>
          <div className="text-nowrap text-ellipsis overflow-hidden">
            <Icon type="icon-fork" className="text-sky-600 mr-1" />
            <span>{data.forks_count} forks</span>
          </div>
          <div className="text-nowrap text-ellipsis overflow-hidden">
            <Icon type="icon-error" className="text-red-700 mr-1" />
            <span>{data.open_issues} open issues</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const fetchData = async ({ page, pageSize, language } = {}) => {
  return api.getRepositories({
    page: page ?? 1,
    per_page: pageSize ?? 10,
    q: `stars:>1${language ? ` language:${language}` : ""}`,
    sort: "stars",
    order: "desc",
    type: "Repositories",
  });
};

const List = (props) => {
  const { language, show } = props;
  const loaderRef = useRef(null);
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log("useEffect: ----", show);
    if (show) {
      fetchData({
        page,
        pageSize: 10,
        language,
      }).then(({ data }) => {
        setList((prev) => [...prev, ...data.items]);
      });
    }
  }, [page, language, show]);

  useEffect(() => {
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && show) {
          setPage((prevPage) => prevPage + 1);
        }
      });
    });
    if (loaderRef.current) {
      ob.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        ob.unobserve(loaderRef.current);
      }
    };
  }, [show]);
  return (
    <div className={classNames(["container", "mx-auto", { hidden: !show }])}>
      <div className="min-h-svh">
        <div className="flex flex-wrap justify-around">
          {list.map((item, index) => (
            <Item key={`${item.id}_${index}`} data={item} index={index + 1} />
          ))}
        </div>
        {page === 1 && list.length === 0 && (
          <div className="flex justify-center h-52 items-center">
            <div className="loader"></div>
          </div>
        )}
      </div>
      <div ref={loaderRef} className="flex justify-center h-52 items-center">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default List;
