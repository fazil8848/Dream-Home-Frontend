import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.css";
import { generateError } from "../../Dependencies/toast";
import {
  useGetOwnersMutation,
  useGetUsersMutation,
  usePropertyManagementMutation,
} from "../../../Redux/Slices/adminApi/adminApislice";
import Spinner from "../../User/Spinner/Spinner";

function Dashboard() {
  const adminInfo = useSelector((state) => state.admin.adminInfo);
  const navigate = useNavigate();
  const [usersLength, setUsersLenght] = useState(0);
  const [ownersLength, setOwnersLenght] = useState(0);
  const [propertyLength, setPropertyLength] = useState(0);
  const [bookedPropertiesLength, setBookedPropertiesLength] = useState(0);
  const [availablePropertiesLength, setAvailablePropertiesLength] = useState(0);
  const [fetchUserLoading, setFetchUserLoading] = useState(false);

  const [getUsersCall] = useGetUsersMutation();
  const [getOwnersCall] = useGetOwnersMutation();
  const [getPropertyCall] = usePropertyManagementMutation();
  useEffect(() => {
    if (!adminInfo) {
      navigate("/admin/login");
    }
  }, [adminInfo]);

  const spark1 = {
    chart: {
      id: "spark1",
      group: "sparks",
      type: "line",
      height: 80,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.2,
      },
    },
    series: [
      {
        data: [25, 66, 41, 59, 25, 44, 12, 36, 9, 21],
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      padding: {
        top: 20,
        bottom: 10,
        left: 110,
      },
    },
    colors: ["#fff"],
    tooltip: {
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function formatter(val) {
            return "";
          },
        },
      },
    },
  };

  const propertiesOptions = {
    chart: {
      width: 480,
      type: "pie",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },

    legend: {
      formatter: function (val, opts) {
        const categories = ["Available", "Booked"];
        return (
          categories[opts.seriesIndex] +
          " - " +
          opts.w.globals.series[opts.seriesIndex]
        );
      },
    },
    title: {
      text: "Avalable & Booked",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const options = {
    chart: {
      width: 480,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },

    legend: {
      formatter: function (val, opts) {
        const categories = ["Owners", "Users"];
        return (
          categories[opts.seriesIndex] +
          " - " +
          opts.w.globals.series[opts.seriesIndex]
        );
      },
    },
    title: {
      text: "Users & Owners",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const fetchUsers = async () => {
    setFetchUserLoading(true);
    try {
      const { users } = await getUsersCall().unwrap();
      const { owners } = await getOwnersCall().unwrap();
      const { properties } = await getPropertyCall().unwrap();
      const bookedProperties = properties.filter(
        (property) => property.is_Booked
      );
      setBookedPropertiesLength(bookedProperties.length);

      // Count the number of properties where is_Booked is false
      const availableProperties = properties.filter(
        (property) => !property.is_Booked
      );
      setAvailablePropertiesLength(availableProperties.length);
      setOwnersLenght(owners.length);
      setUsersLenght(users.length);
      setPropertyLength(properties.length);
    } catch (error) {
      console.log(error);
      generateError(error.message);
    } finally {
      setFetchUserLoading(false);
    }
  };

  const series = [ownersLength, usersLength];
  const propertySeries = [availablePropertiesLength, bookedPropertiesLength];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="w-full flex justify-between gap-5 p-5 h-40 ">
        <div className="w-full border rounded-md h-full sparkboxes ">
          <div className="col-span-3 h-full">
            <div className="box box1 h-full">
              <div className="details">
                <h3 className="text-2xl font-bold">
                  {usersLength + ownersLength}
                </h3>
                <h4 className="text-sm font-semibold">TOATAL USERS</h4>
              </div>
              <ReactApexChart
                options={spark1}
                series={spark1.series}
                type="line"
                height={spark1.chart.height}
              />
            </div>
          </div>
        </div>
        <div className="w-full border rounded-md h-full sparkboxes ">
          <div className="col-span-3  h-full">
            <div className="box box2 h-full">
              <div className="details">
                <h3 className="text-2xl font-bold">{ownersLength}</h3>
                <h4 className="text-sm font-semibold">OWNERS</h4>
              </div>
              <ReactApexChart
                options={spark1}
                series={spark1.series}
                type="line"
                height={spark1.chart.height}
              />
            </div>
          </div>
        </div>
        <div className="w-full border rounded-md h-full sparkboxes ">
          <div className="col-span-3  h-full">
            <div className="box box3 h-full">
              <div className="details">
                <h3 className="text-2xl font-bold">{usersLength}</h3>
                <h4 className="text-sm font-semibold">Users</h4>
              </div>
              <ReactApexChart
                options={spark1}
                series={spark1.series}
                type="line"
                height={spark1.chart.height}
              />
            </div>
          </div>
        </div>
        <div className="w-full border rounded-md h-full sparkboxes ">
          <div className="col-span-3  h-full">
            <div className="box box4 h-full ">
              <div className="details">
                <h3 className="text-2xl font-bold">{propertyLength}</h3>
                <h4 className="text-sm font-semibold">TOATAL PROPERTIES</h4>
              </div>
              <ReactApexChart
                options={spark1}
                series={spark1.series}
                type="line"
                height={spark1.chart.height}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between p-5">
        <div id="chart" className="bg-white p-5 rounded-md shadow-xl">
          {!fetchUserLoading ? (
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              width={520}
            />
          ) : (
            <>
              {/* <div className="">
                <Spinner />
              </div> */}
            </>
          )}
        </div>
        <div id="chart" className="bg-white p-5 rounded-md shadow-xl">
          <ReactApexChart
            options={propertiesOptions}
            series={propertySeries}
            type="pie"
            width={520}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
