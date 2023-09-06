const ProjectsSkeleton = () => {
  return (
    <div className="w-auto ml-[-10px] mr-[-10px] flex flex-wrap">
      <div className="w-1/3 px-[10px] mb-[20px] 3xl:w-1/2 lg:w-full">
        <div className="ip__Card">
          <h3 className="ip__CardTitle">
            <span className="skeletonBox w-[150px] ml-[8px] mb-[20px]" />
          </h3>
          <div className="ipTableWrapper">
            <table className="i__ps__Table">
              <thead>
                <tr>
                  <th className="w-[60%]">
                    <span className="skeletonBox mb-[5px]" />
                  </th>
                  <th className="!text-center w-[20%]">
                    <span className="skeletonBox mb-[5px]" />
                  </th>
                  <th className="!text-center w-[20%]">
                    <span className="skeletonBox mb-[5px]" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="profileDetails w-[60%]">
                    <div className="profile__WS">
                      <span className="skeletonBox w-[34px] h-[34px]" />
                      <p className="profile__Name">
                        <span className="skeletonBox" />
                      </p>
                    </div>
                  </td>
                  <td className="task text-center w-[20%]">
                    <span className="skeletonBox" />
                  </td>
                  <td className="amount text-center w-[20%]">
                    <span className="skeletonBox" />
                  </td>
                </tr>
                <tr>
                  <td className="profileDetails w-[60%]">
                    <div className="profile__WS">
                      <span className="skeletonBox w-[34px] h-[34px]" />
                      <p className="profile__Name">
                        <span className="skeletonBox" />
                      </p>
                    </div>
                  </td>
                  <td className="task text-center w-[20%]">
                    <span className="skeletonBox" />
                  </td>
                  <td className="amount text-center w-[20%]">
                    <span className="skeletonBox" />
                  </td>
                </tr>
                <tr>
                  <td className="profileDetails w-[60%]">
                    <div className="profile__WS">
                      <span className="skeletonBox w-[34px] h-[34px]" />
                      <p className="profile__Name">
                        <span className="skeletonBox" />
                      </p>
                    </div>
                  </td>
                  <td className="task text-center w-[20%]">
                    <span className="skeletonBox" />
                  </td>
                  <td className="amount text-center w-[20%]">
                    <span className="skeletonBox" />
                  </td>
                </tr>
                <tr>
                  <td className="profileDetails w-[60%]">
                    <div className="profile__WS">
                      <span className="skeletonBox w-[34px] h-[34px]" />
                      <p className="profile__Name">
                        <span className="skeletonBox" />
                      </p>
                    </div>
                  </td>
                  <td className="task text-center w-[20%]">
                    <span className="skeletonBox" />
                  </td>
                  <td className="amount text-center w-[20%]">
                    <span className="skeletonBox" />
                  </td>
                </tr>
                <tr>
                  <td className="profileDetails w-[60%]">
                    <div className="profile__WS">
                      <span className="skeletonBox w-[34px] h-[34px]" />
                      <p className="profile__Name">
                        <span className="skeletonBox" />
                      </p>
                    </div>
                  </td>
                  <td className="task text-center w-[20%]">
                    <span className="skeletonBox" />
                  </td>
                  <td className="amount text-center w-[20%]">
                    <span className="skeletonBox" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSkeleton;
