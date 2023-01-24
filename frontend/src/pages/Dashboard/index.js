import './style.css';

const Report = () => {

    const [selectedYear, setSelectedYear] = React.useState('2023');
    const [selectedChannel, setSelectedChannel] = React.useState('All');
    const [selectedUser, setSelectedUser] = React.useState('All');
    const [selectedSimType, setSelectedSimType] = React.useState('All');

    const apiUrl = useSelector((state) =>
        state.getIn(['config', 'apiUrl'])
    );

    const guid = useSelector((state) =>
        state.getIn([
        'modules',
        ])
    );

    const {
        isLoading: isLoadingReportingData,
        data: reportingDataResponse,
        error: loadingReportingDataError,
    } = useFetchye(`${apiUrl}/v1/requests`, getRequestHeaders(guid));

    if (isLoadingReportingData) {
        return (
            <div className={styles.spinner}>
                <ProgressCircle size="lg" />
            </div>
        );
    }
    if (reportingDataResponse?.status.ok || loadingReportingDataError) {
        return (
            <RenderModule
                moduleName="error-message"
                props={{
                    asModal: true,
                    options: {
                    header: 'An error occured while loading chart data',
                },}}
            />
        );
    }

    const simByMonth = {};
    // const simByMonth = {};

    const users = new Set();
    const channels = new Set();
    const simTypes = new Set();

    const getYear = (record) => {
        const submissionDateString = record.request_date;
        const dateObject = new Date(submissionDateString);
        return dateObject.getFullYear();
    };

    reportingDataResponse.body.data.record_list
    // .filter((record) => getYear(record) === +selectedYear)

    .forEach((record) => {
        // add type into set
        simTypes.add(record.sim_type.sim_type_name);


        users.add(String(record.requester_name));
    });

    reportingDataResponse.body.data.record_list
        .filter((record) =>
            selectedSimType === 'All'
            ? true
            : record.sim_type.sim_type_name === selectedSimType
    )
    .filter((record) => {
        channels.add(record.channel.channel_name);
        if (selectedChannel === 'All') return true;
        // filter by selected Channel
        return record.channel.channel_name === selectedChannel;
    })
    .filter((record) => {
        // filter by selected user
        return user === 'All'
        ? true
        : String(record.requester_name) === user;
    })
    .forEach((record) => {
        const submissionDateString = record.request_date; // ex. "2021-07-28 21:36",
        const dateObject = new Date(submissionDateString);

        if (getYear(record) === +selectedYear) {
        // it returns month numbers from 0-11
        const month = dateObject.getMonth();
        }
    });

    // where each entry is indexed by month from 0-11
    // const simByMonth = new Array(12)
    // .fill(1)
    // .map((_, monthIndex) => simByMonth[monthIndex] ?? 0);

    // const simByMonth = new Array(12)
    // .fill(1)
    // .map((_, monthIndex) => simByMonth[monthIndex] ?? 0);

    return (
        <div className="row pad-4 flex flex-justify-center">
            <div className="pad-report">
                <div className="pad-dropdown">
                    {/* <div className="row pad-4-b"> */}
                        <DropdownSelector
                            filterBy="Year"
                            name="selectYear"
                            options={['2023', '2022', '2021']}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        />
                        <DropdownSelector
                            filterBy="Sim Type"
                            options={['All', ...simTypes]}
                            onChange={(e) => setSelectedSimType(e.target.value)}
                        />
                        <DropdownSelector
                            filterBy="Channel"
                            name="selectChannel"
                            options={['All', ...channels]}
                            onChange={(e) => setSelectedChannel(e.target.value)}
                        />
                        <DropdownSelector
                            filterBy="User"
                            name="selectUsername"
                            options={['All', ...users]}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        />
                    {/* </div> */}
                </div>
                <div className="pad-graph">
                    <div className="dls-hc">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={{
                                chart: {
                                    type: 'column',
                                    width: 1000,
                                    styledMode: true,
                                },
                                accessibility: {
                                enabled: false,
                                },
                                title: {
                                text: `${
                                    selectedSimType === 'All' ? '' : selectedSimType
                                } ${selectedYear} Sim`,
                                },
                                xAxis: {
                                    categories: [
                                    'Jan',
                                    'Feb',
                                    'Mar',
                                    'Apr',
                                    'May',
                                    'Jun',
                                    'Jul',
                                    'Aug',
                                    'Sep',
                                    'Oct',
                                    'Nov',
                                    'Dec',
                                    ],
                                    crosshair: true,
                                },
                                yAxis: {
                                    title: {
                                        useHTML: true,
                                        text: 'Number of submitted sim',
                                    },
                                },
                                tooltip: {
                                    headerFormat:
                                        '<span style="font-size:10px">{point.key}</span><table>',
                                    pointFormat:
                                        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                                    footerFormat: '</table>',
                                    shared: true,
                                    useHTML: true,
                                },
                                plotOptions: {
                                    column: {
                                        pointPadding: 0.2,
                                        borderWidth: 0,
                                    },
                                },

                                series: [
                                    // {
                                    //     data: simByMonthArray,
                                    //     name: `Sim (Total: ${simByMonthArray.reduce(
                                    //         (total, current) => total + current,
                                    //         0
                                    //     )})`,
                                    // },
                                    // {
                                    //     data: simByMonthArray,
                                    //     name: `Sim (Total: ${simByMonthArray.reduce(
                                    //         (total, current) => total + current,
                                    //         0
                                    //     )})`,
                                    // },
                                ],
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;