import React, { HTMLAttributes } from "react";

interface Props {
    type: string | null,
    setType: (type : string | null) => void; 
};

function TestTypeFilter({ type, setType, }: Props) {
  return (
    <div className="w-full flex justify-center items-center bg-slate-100 mt-4 rounded-lg" >
      <ul className="w-fit justify-center flex p-4 rounded-lg md:flex-row space-x-8 md:mt-0 text-center text-xs md:text-lg">
        <li
          className={
            type === null ? "active-test-type" : "inactive-test-type"
          }
          onClick={() => setType(null)}
        >
          Todos
        </li>
        <li
          className={
            type === "SP" ? "active-test-type" : "inactive-test-type"
          }
          onClick={() => setType("SP")}
        >
          Sala de Provas
        </li>
        <li
          className={
            type === "HT" ? "active-test-type" : "inactive-test-type"
          }
          onClick={() => setType("HT")}
        >
          Home Test
        </li>
      </ul>
    </div>
  );
}

export default TestTypeFilter;
