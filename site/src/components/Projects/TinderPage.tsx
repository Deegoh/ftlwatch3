import React, { useMemo } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
  Card,
  CardBody,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import { commonTitle } from 'Utils/commonTitle';
import Separator from 'Common/Separator';
import classNames from 'classnames';
import GaugeChart from 'react-gauge-chart';
import { useSearchParams } from 'react-router-dom';
import { objUrlEncode } from 'Utils/objUrlEncode';




export function TinderPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [searchParams] = useSearchParams();
  const defaultProject = searchParams.get('project');

  const [values, setValues] = React.useState<any[] | undefined>(undefined);
  const [filters, setFilters] = React.useState<any[] | undefined>(undefined);

  const [currentFilter, setCurrentFilter] = React.useState<string | undefined>(defaultProject !== null ? defaultProject : undefined);

  React.useEffect(() => {document.title = commonTitle('Tinder');}, []);

  function TinderCard(card: any): JSX.Element {

    return (
      <Card id={`${card.circle}-${card.user_id}`} className="flex w-60 border-black border-2">

        <CardBody className="flex flex-col grow text-center align-center p-2">

          <p color="blue-gray">
            {card.projects}
          </p>

          <div className='grow'></div>
          <div className='flex flex-row justify-between items-center'>
            <div>
              <p color="blue-gray">
                <a href={`https://profile.intra.42.fr/users/${card.login}`}>{card.login}</a>
              </p>
              <img className='max-h-20 rounded-lg object-contain' src={card.avatar_url} alt="profile-picture" />
            </div>

            <GaugeChart id={`gauge-chart-${card.circle}-${card.user_id}`}
              className=''
              style={{ width: '150px' }}
              marginInPercent={0.01}
              nrOfLevels={10}
              colors={['#FF6000', '#00B0B0']}
              animate={false}
              percent={card.score/200}
              formatTextValue={(value: string) => `${parseInt(value)*2}%`}
            />
            <div className='grow'></div>

          </div>
        </CardBody>
      </Card>
    );
  }

  const subOptions = useMemo(() => (
    <>
      <div className='flex flex-wrap gap-2 justify-evenly'>

        {filters && Object.entries(filters).map((filtertab) => {
          return (
            <Button
              key={filtertab[0]}
              className={classNames(filtertab[0] === currentFilter ? 'selected-option' : 'available-option' )}
              onClick={() => { setCurrentFilter((prev) => prev !== filtertab[0] ? filtertab[0] : undefined); } }
            >
              {filtertab[1].projects.join('/')}
            </Button>
          );
        })}
      </div>
      <Separator></Separator>
    </>

  ), [currentFilter, filters]);

  React.useEffect(() => {
    axios
      .get('/?page=projects&action=get_tinder',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setFilters(res.data.filters);
          setValues(res.data.values);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);

  React.useEffect(() => {
    const args = objUrlEncode({
      ...Object.fromEntries(searchParams.entries()),
      "project": currentFilter
    });
    window.history.replaceState(null, '', `${(args && args !== '') ? `?${args}` : ''}`);

  }, [currentFilter]);


  const displayValues = useMemo(() => {

    if (values === undefined) {
      return undefined;
    }

    return Object.entries(values).flatMap((filtertab) => {

      if (currentFilter !== undefined && filtertab[0] !== currentFilter) {
        return [];
      }

      return filtertab[1]
        .sort((a: any, b: any) => a.score < b.score)
        .map((arg: any) => { return { ...arg, circle: filtertab[0], projects: (filters && filters[filtertab[0] as any].projects.join('/') || 'none') };});
    });

  }, [currentFilter, filters, values]);


  //
  return (
    <div className='my-content'>
      <SuperCards
        values={displayValues}
        customCard={TinderCard}

        subOptions={subOptions}

        tableTitle='Tinder'
        tableDesc='To find peers to do group projects'
        options={[10, 25, 50, 100]}
        // reloadFunction={() => { setValues([]); }}
      />
    </div>
  );
}
