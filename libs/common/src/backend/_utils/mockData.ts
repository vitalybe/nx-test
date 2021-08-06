export default {
  cacheGroups: ["Cache Group 1", "Cache Group 2", "Cache Group 3"],
  sites: ["site1.com", "site2.com", "site3.com", "all-transparent-sites"],
  dsgs: ["Dsg1", "Dsg2", "Dsg3", "Dsg4"],
  granularities: {
    series: {
      l7VideoByContentProviderWirePerSite1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecond2xxDeliveryPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByContentProviderWirePerSite: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      servedLocalAndRemoteBitrate1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromOtherLocal2xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromUpstream1xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2Delivered: { granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }] },
      l7VideoByContentProviderPerSite5Min: {
        granularity: [{ dataInterval: 300, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      qoeBwDelivered1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwOdciFromOrigin: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoServedPerSite5Min: {
        granularity: [{ dataInterval: 300, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      qoeVolumeAnalyzed: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromOtherRelay1xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      subscribers: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecond4xxDeliveryPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByContentProviderPerSite: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondResponsesToClient2xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      qoeBwLocalDelivery1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2OdciFromMidRelay: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoLocalDeliveryPerSite1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7BwVideoTotal: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwOdciFromMidLocal: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      qoeDurationAnalyzed: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondResponsesToClient1xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      odciFromOriginBitrate: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoTotalPerSite5Min: {
        granularity: [{ dataInterval: 300, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromOtherRelay2xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      odciFromOriginLocalBitrate: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByOdciFromOriginPerSite: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2LocalDelivery: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      odciFromOriginLocalAndRemoteBitrate: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2OdciFromMidLocal: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByOdciFromOriginPerSite1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2ByContentProviderWire: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      qoeVolumeOdciFromOriginLocal: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByOdciFromMidRelayPerSite5Min: {
        granularity: [{ dataInterval: 300, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7BwVideoTotalInternal: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      qoeVolumeOdciFromOriginRemote: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      qoeBwOdciFromOrign1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromOtherRelay3xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwByContentProviderWire: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7AsymetricVideo: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromUpstream5xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      averageStreamedBitrate: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromUpstream2xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromOtherLocal3xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      qoeBwLocalAndRemoteDelivery1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondResponsesToClientOtherLocal2xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      totalTpsCapacity: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromOtherLocal1xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwUdpMulticast: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondDeliveryPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwCacheable: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecond4xxOriginPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7BwVideoByOdciFromOriginPerSite: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByOdciFromMidLocalPerSite5Min: {
        granularity: [{ dataInterval: 300, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondResponsesToClientOtherLocal4xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoServed: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      qoeDurationServed: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2Cacheable: { granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }] },
      transactionsPerSecondResponsesToClient4xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromOtherRelay5xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      qoeVolumeServed: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      servedRemoteBitrate: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      analyzedBitrate: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecond2xxOriginPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByContentProviderWirePerSite5Min: {
        granularity: [{ dataInterval: 300, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromOtherLocal5xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromUpstream4xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2NonCacheable: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecond3xxDeliveryPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromOtherRelay4xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      analyzedAndServedBitrate: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwDelivered: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecond5xxOriginPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwNonCacheable: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromUpstream3xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondResponsesToClientOtherLocal1xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoLocalDeliveryPerSite5Min: {
        granularity: [{ dataInterval: 300, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwOdciFromMidRelay: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7BwDownstream: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByOdciFromMidRelay: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2OdciFromOrigin: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecond1xxDeliveryPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoTotalPerSite: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByOdciFromMidLocalPerSite: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2UdpMulticast: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondFromOtherLocal4xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondResponsesToClient3xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      servedBitrate: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByOdciFromMidRelayPerSite: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondOriginPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2ByContentProvider: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoServedPerSite: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      servedLocalAndRemoteBitrate: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      servedBitrate1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwTotal: { granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }] },
      l7BwVideoByOdciFromMidRelayPerSite: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecond1xxOriginPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwLocalDelivery: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByOdciFromMidRelayPerSite1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByOdciFromOriginPerSite5Min: {
        granularity: [{ dataInterval: 300, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      servedLocalBitrate1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondResponsesToClientOtherLocal5xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2Total: { granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }] },
      qoeVolumeOdciFromOrigin: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7BwUpstream: { granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }] },
      totalBwCapacity: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2AvailableBwCapacity: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondResponsesToClient5xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoTotal: { granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }] },
      availableDeliveryBw: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoLocalDeliveryPerSite: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l2BwByContentProvider: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoByContentProviderPerSite1Min: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      l7VideoTotalIntrernal: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecondResponsesToClientOtherLocal3xxPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecond5xxDeliveryPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      servedLocalBitrate: {
        granularity: [{ dataInterval: 3600, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
      transactionsPerSecond3xxOriginPerSite: {
        granularity: [{ dataInterval: 60, fromPeriodSeconds: 0, toPeriodSeconds: 9223372036854775807 }],
      },
    },
  },
  networks: ["Network1", "Network2", "Network3", "Network4"],
  networksWithId: [
    { id: 1, name: "Network1" },
    { id: 2, name: "Network2" },
    { id: 3, name: "Network3" },
  ],
  qns: ["SystemId1", "SystemId2", "SystemId3", "SystemId4"],
  geos: ["Geo1", "Geo2", "Geo3", "Geo4"],
  ispId: ["ispId-1", "ispId-2"],
  footprintServiceName: ["footprintServiceName-1", "footprintServiceName-2"],
  footprintId: ["footprintId-1", "footprintId-2", "footprintId-3"],
  dltId: ["dlt-1", "dlt-2"],
  deliveryUnitIds: ["du-1", "du-2", "du-3", "du-4", "du-5"],
  dsRevisionLabels: "Test Label",
};
