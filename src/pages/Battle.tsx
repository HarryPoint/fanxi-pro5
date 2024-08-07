import { KeyboardEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import { api } from "@/utils";

const BattleInput: React.FC<{
  label: string;
  info: any;
  onSubmit: (arg: any) => void;
}> = (props) => {
  const { label, info, onSubmit } = props;
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(false);
  }, [inputText]);

  const handleFetch = async () => {
    setErrMsg("");
    if (inputText) {
      setLoading(true);
      try {
        const { data } = await api.getUser(inputText);
        setSubmitted(true);
        onSubmit(data);
      } catch (err) {
        setErrMsg(
          err?.response?.data?.message ?? err?.message ?? "request error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleFetch();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border">
      <label className="text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="flex items-center mt-2">
        <div className="relative w-full mr-3">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-4 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
            placeholder="输入 Github 用户名，获取用户信息"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {submitted && info && (
            <Icon
              type="icon-check"
              className="absolute right-2 top-2 text-green-600"
            />
          )}
        </div>
        <button
          type="button"
          className="ml-2 w-20 h-9 text-center disabled:cursor-not-allowed disabled:opacity-50 bg-green-100 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-200"
          disabled={submitted || loading}
          onClick={handleFetch}
        >
          {loading ? (
            <Icon type="icon-sync" className="mx-auto text-lg animate-spin" />
          ) : submitted ? (
            <Icon type="icon-stop" className="mx-auto text-lg" />
          ) : (
            <span>SUBMIT</span>
          )}
        </button>
      </div>
      <div className="text-red-500">{errMsg}</div>
      {submitted && info && !loading && (
        <div className="flex justify-center p-9">
          <img className="w-28 aspect-square" src={info.avatar_url} />
        </div>
      )}
    </div>
  );
};

const InsItem: React.FC<{ title: string; icon: string }> = (props) => {
  const { title, icon } = props;
  return (
    <div>
      <p className="text-sm leading-5 h-10 lg:text-2xl">{title}</p>
      <div className="mt-4 mx-auto bg-sky-100 w-3/5 lg:w-2/5 aspect-square flex items-center justify-center rounded-full hover:scale-110 transition-transform duration-300">
        <Icon
          type={icon}
          className="w-14 h-14 lg:w-20 lg:h-20 text-orange-600"
        />
      </div>
    </div>
  );
};

const Battle: React.FC = () => {
  const navigate = useNavigate();
  const [playerOne, setPlayerOne] = useState<any>(null);
  const [playerTwo, setPlayerTwo] = useState<any>(null);
  return (
    <div className="container mx-auto px-2">
      <div className="min-h-svh flex flex-col justify-center items-stretch gap-12">
        <h3 className="text-4xl text-center">Instructions</h3>
        <div className="grid grid-cols-3 gap-5 mt-5 text-center">
          <InsItem title="Enter two Github users" icon="icon-team"></InsItem>
          <InsItem title="Battle" icon="icon-send" />
          <InsItem title="See the winner" icon="icon-trophy" />
        </div>
        <div className="text-3xl text-center mt-2 lg:mt-12">
          <h4>Players</h4>
          {playerOne && playerTwo ? (
            <button
              type="button"
              className="ml-2 h-9 text-center disabled:cursor-not-allowed disabled:opacity-50 bg-sky-100 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-sky-200"
              onClick={() =>
                navigate({
                  pathname: "/result",
                  search: `?playerOne=${playerOne?.login}&playerTwo=${playerTwo?.login}`,
                })
              }
            >
              Battle
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-3">
          <BattleInput
            label="Player One"
            info={playerOne}
            onSubmit={setPlayerOne}
          />
          <BattleInput
            label="Player Two"
            info={playerTwo}
            onSubmit={setPlayerTwo}
          />
        </div>
      </div>
    </div>
  );
};

export default Battle;
