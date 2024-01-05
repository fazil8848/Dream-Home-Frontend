import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.css";
import { generateError } from "../../Dependencies/toast";
import Spinner from "../../User/Spinner/Spinner";
import {
  useGetBookingsOwnerMutation,
  useGetEnquiriesMutation,
  useGetPropertiesMutation,
} from "../../../Redux/Slices/ownerApi/ownerApiSlice";

function Dashboard() {
  const { ownerInfo } = useSelector((state) => state.owner);
  const ownerId = ownerInfo._id;
  const navigate = useNavigate();
  const [bookingsLenght, setBookingsLenght] = useState(0);
  const [enquiriesLength, setEnquiriesLength] = useState(0);
  const [propertyLength, setPropertyLength] = useState(0);
  const [fetchUserLoading, setFetchUserLoading] = useState(false);

  const [getEnquiriessCall] = useGetEnquiriesMutation();
  const [getBookingsCall] = useGetBookingsOwnerMutation();
  const [getPropertyCall] = useGetPropertiesMutation();
  useEffect(() => {
    if (!ownerInfo) {
      navigate("/admin/login");
    }
  }, [ownerInfo]);

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
        const categories = ["Available", "Booked", "Total Properties"];
        return (
          categories[opts.seriesIndex] +
          " - " +
          opts.w.globals.series[opts.seriesIndex]
        );
      },
    },
    title: {
      text: "Total Properties",
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
        const categories = ["Reserved", "Booked"];
        return (
          categories[opts.seriesIndex] +
          " - " +
          opts.w.globals.series[opts.seriesIndex]
        );
      },
    },
    title: {
      text: "Booked & Reserved",
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
      const { enquiries } = await getEnquiriessCall(ownerId).unwrap();
      console.log(enquiries);
      const { bookings } = await getBookingsCall(ownerId).unwrap();
      console.log(bookings);
      const { properties } = await getPropertyCall({ id: ownerId }).unwrap();
      console.log(properties);

      setBookingsLenght(bookings.length);
      setEnquiriesLength(enquiries.length);
      setPropertyLength(properties.length);
    } catch (error) {
      console.log(error);
      generateError(error.message);
    } finally {
      setFetchUserLoading(false);
    }
  };

  const series = [enquiriesLength, bookingsLenght];
  const propertySeries = [
    propertyLength - bookingsLenght,
    bookingsLenght,
    propertyLength,
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="w-1/2 flex justify-between gap-5 p-5 h-40 ">
        <div className="w-full border rounded-md h-full sparkboxes ">
          <div className="col-span-3 h-full">
            <div className="box box3 h-full">
              <div className="details pe-2">
                <h3 className="text-2xl font-bold">
                  {enquiriesLength + bookingsLenght}
                </h3>
                <h4 className="text-sm font-semibold">Booked & Reserved</h4>
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
              <div className="details me-2">
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
      <div className="flex flex-col gap-5 lg:flex-row justify-between p-5 ">
        <div id="chart" className="bg-white p-5 w-full rounded-md shadow-xl">
          {!fetchUserLoading ? (
            <ReactApexChart options={options} series={series} type="donut" />
          ) : (
            <>
              {/* <div className="">
                <Spinner />
              </div> */}
            </>
          )}
        </div>
        <div id="chart" className="bg-white p-5 w-full rounded-md shadow-xl">
          <ReactApexChart
            options={propertiesOptions}
            series={propertySeries}
            type="pie"
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
