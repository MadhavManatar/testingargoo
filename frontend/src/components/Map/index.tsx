import {
  MapsComponent,
  MapsTooltip,
  Inject,
  LayersDirective,
  LayerDirective,
  MarkersDirective,
  MarkerDirective,
  Marker,
  Zoom,
} from '@syncfusion/ej2-react-maps';

type MapData = {
  name: string;
  latitude: number;
  longitude: number;
};

type Props = {
  data: MapData;
};

const Map = (props: Props) => {
  const { data } = props;

  return (
    <MapsComponent
      id="maps"
      centerPosition={{
        latitude: data?.latitude,
        longitude: data?.longitude,
      }}
      zoomSettings={
        {
        zoomFactor: 12,
        enable: true,
        zoomOnClick : true,
        mouseWheelZoom : true,
        maxZoom: 20,
        minZoom: 1,
      }}
    >
      <Inject services={[MapsTooltip, Marker, Zoom]} />
      <LayersDirective>
        <LayerDirective layerType="OSM" animationDuration={0}>
          <MarkersDirective>
            <MarkerDirective
              visible
              template='<div><img src="https://ej2.syncfusion.com/react/demos/src/maps/images/ballon.png" style="height:30px;width:20px;"></img></div>'
              dataSource={[data]}
              tooltipSettings={{
                visible: true,
                valuePath: 'name',

              }}
            />
          </MarkersDirective>
        </LayerDirective>
      </LayersDirective>
    </MapsComponent>
  );
};

export default Map;
