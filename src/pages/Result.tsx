import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../utils";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

const ItemInfo: React.FC<{ data: any; title: string }> = (props) => {
  const { data, title } = props;
  return (
    <div className="p-2 shadow-lg border rounded-lg hover:scale-110 transition-all lg:w-96 mx-auto">
      <h4 className="text-center text-2xl">{title}</h4>
      <img className="w-full aspect-square" src={data?.avatar_url} />
      <div className="text-center leading-10">Scores: {data?.public_repos}</div>
      <h6 className="text-center">{data?.login}</h6>
      <ul>
        <li className="text-ellipsis overflow-hidden text-nowrap">
          <Icon type="icon-location" className="text-sky-600 mr-1" />
          <span>{data?.location}</span>
        </li>
        <li className="text-ellipsis overflow-hidden text-nowrap">
          <Icon type="icon-team" className="text-green-500 mr-1" />
          <span>{data?.followers}</span>
        </li>
        <li className="text-ellipsis overflow-hidden text-nowrap">
          <Icon type="icon-adduser" className="text-red-600 mr-1" />
          <span>{data?.following}</span>
        </li>
        <li className="text-ellipsis overflow-hidden text-nowrap">
          <Icon type="icon-code" className="text-yellow-600 mr-1" />
          <span>{data?.public_repos}</span>
        </li>
      </ul>
    </div>
  );
};

const Result = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const playerOne = searchParams.get("playerOne");
  const playerTwo = searchParams.get("playerTwo");
  const [playerOneInfo, setPlayerOneInfo] = useState<any>(null);
  const [playerTwoInfo, setPlayerTwoInfo] = useState<any>(null);
  useEffect(() => {
    if (playerOne && playerTwo) {
      Promise.all([
        api.getUser(playerOne, { tips: true }),
        api.getUser(playerTwo, { tips: true }),
      ])
        .then(([{ data: info1 }, { data: info2 }]) => {
          setPlayerOneInfo(info1);
          setPlayerTwoInfo(info2);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [playerOne, playerTwo]);

  const [winnerInfo, setWinnerInfo] = useState<any>(null);

  useEffect(() => {
    if (playerOneInfo && playerTwoInfo) {
      if (playerOneInfo?.public_repos > playerTwoInfo?.public_repos) {
        setWinnerInfo(playerOneInfo);
      } else {
        setWinnerInfo(playerTwoInfo);
      }
    }
  }, [playerOneInfo, playerTwoInfo]);

  const handleRest = () => {
    navigate("/battle");
  };

  return (
    <div className="container mx-auto">
      {loading && (
        <div className="h-96 flex justify-center items-center">
          <div className="loader"></div>
        </div>
      )}
      {!loading && (
        <div className="px-2">
          <div className="grid grid-cols-2 gap-2 lg:py-14">
            <ItemInfo
              data={playerOneInfo}
              title={
                winnerInfo && winnerInfo.id === playerOneInfo.id
                  ? "Winner"
                  : "Loser"
              }
            />
            <ItemInfo
              data={playerTwoInfo}
              title={
                winnerInfo && winnerInfo.id === playerTwoInfo.id
                  ? "Winner"
                  : "Loser"
              }
            />
          </div>
          <div className="flex justify-center py-9">
            <button
              className="ml-2 h-9 text-center disabled:cursor-not-allowed disabled:opacity-50 bg-green-100 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-200"
              onClick={handleRest}
            >
              RESET
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
