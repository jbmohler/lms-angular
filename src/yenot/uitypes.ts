import { LocalDate, LocalTime, convert } from '@js-joda/core';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { ColumnMeta } from '../yenot/apiclient';

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(' ');
}

function autoTransformLabel(prelt: ColumnMeta) {
  if (prelt === null || prelt === undefined) {
    return null;
  }
  if (prelt[1] !== null && prelt[1].label !== undefined) return prelt[1].label;
  else return titleCase(prelt[0].replaceAll('_', ' '));
}

function listconcat(param: any) {
  if (param.value === null || param.value === undefined) {
    return null;
  }
  return param.value.join('; ');
}

var currency_format = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
});
function format_currency(param: any) {
  if (param.value === null || param.value === undefined) {
    return null;
  }
  return currency_format.format(param.value);
}

function format_date(param: any) {
  // Luxon library seems quite epic, but
  // https://github.com/moment/luxon/issues/1141 is a pivotal lack hurting us
  // here.   Went for js-joda.
  if (param.value === null || param.value === undefined) {
    return null;
  }
  // convert to js date for locale aware formatting (use noon local time to
  // avoid time zone issues -- which I think is safe, but I'm less sure is
  // elegant)
  let noon = LocalDate.parse(param.value).atTime(LocalTime.NOON);
  return convert(noon).toDate().toLocaleDateString();
}

function render_boolean(params: ICellRendererParams) {
  // TODO:  this is always editable, but many grids are readonly and
  // this control should behave accordingly.
  var input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = params.value;
  input.addEventListener('click', function (event) {
    params.value = !params.value;
    params.node.data.fieldName = params.value;
  });
  return input;
}

type RenderFunction = (params: ICellRendererParams) => any;

function factory_render_obxreference(cc: ColumnMeta): RenderFunction {
  var tt = cc[1].type;
  var m = tt.match(/^(yenot|yenot)_([a-z]+)$/);
  var entitySingular = m[2];

  function render_yenot_x_name(params: ICellRendererParams) {
    var a = document.createElement('a');
    a.href = `/entity/${entitySingular}/${params.value.id}`;
    a.innerText = params.value.ent_name;
    return a;
  }

  return render_yenot_x_name;
}

function factory_render_obxname(cc: ColumnMeta): RenderFunction {
  var tt = cc[1].type;
  var m = tt.match(/^(yenot|yenot)_([a-z]+)\.name$/);
  var entitySingular = m[2];
  var keyColumn = cc[1].url_key;

  function render_yenot_x_name(params: ICellRendererParams) {
    var a = document.createElement('a');
    a.href = `/entity/${entitySingular}/${params.data[keyColumn]}`;
    a.innerText = params.value;
    return a;
  }

  return render_yenot_x_name;
}

function isVisible(cc: ColumnMeta): boolean {
  if (cc[1] === null) {
    return true;
  } else if (cc[1].hidden !== undefined && cc[1].hidden) {
    return false;
  } else if (cc[1].type !== undefined && cc[1].type.endsWith('.surrogate')) {
    return false;
  }
  return true;
}

function isVisibleForm(cc: ColumnMeta): boolean {
  if (cc[1] === null) {
    return true;
  } else if (cc[1].hidden !== undefined && cc[1].hidden) {
    return false;
  } else if (
    cc[1].type !== undefined &&
    cc[1].type.endsWith('.surrogate') &&
    cc[0] === 'id'
  ) {
    // TODO:  The id clause here is sort of kooky but forms are a little
    // different because we do really want to save the surrogate key where-as
    // on a (read-only) list the display name is the crucial part.
    return false;
  }
  return true;
}

export function columnsAgGrid(columns: ColumnMeta[]): ColDef[] {
  function gtype(cc: ColumnMeta): any {
    if (cc[1] !== null && cc[1].type !== undefined) {
      var tt = cc[1].type;
      if (tt == 'boolean')
        // https://stackoverflow.com/questions/41706848/how-to-use-a-checkbox-for-a-boolean-data-with-ag-grid
        return { cellRenderer: render_boolean };
      if (tt == 'integer') return { type: 'rightAligned' };
      if (tt == 'date') return { formatter: format_date };
      if (tt == 'currency_usd')
        return { formatter: format_currency, type: 'rightAligned' };
      if (tt == 'stringlist') return { formatter: listconcat };
      if (entityList.includes(tt)) {
        let a = tt.match(/^(yenot|yenot)_([a-z]+)/);
        return { cellRenderer: factory_render_obxreference(cc) };
      }
      if (tt.match(/^(yenot|yenot)_([a-z]+)\.name$/)) {
        return { cellRenderer: factory_render_obxname(cc) };
      }
    }
    return {};
  }

  var grcol = columns.filter(isVisible).map(function (cc) {
    var gt = gtype(cc);
    return {
      field: cc[0],
      headerName: autoTransformLabel(cc),
      valueFormatter: gt.formatter,
      type: gt.type,
      cellRenderer: gt.cellRenderer,
      // itemTemplate: gt.itemTemplate
    };
  });
  return grcol;
}

function toPlural(s: string) {
  if (s.endsWith('y')) {
    return s.slice(0, -1) + 'ies';
  } else {
    return s + 's';
  }
}

export interface ControlInputDef {
  field: string;
  label: string;
  type: string;
  params?: any;
  options?: any[];
}

let entityList = [
  'yenot_customer',
  'yenot_employee',
  'yenot_estimate',
  'yenot_item',
  'yenot_jobtransfer',
  'yenot_job',
  'yenot_opportunity',
  'yenot_purchaseorder',
  'yenot_salesperson',
  'yenot_paycheck',
  'yenot_user',
  'yenot_vendor',
];

export function formControlInputs(columns: ColumnMeta[]): ControlInputDef[] {
  function gtype(cc: ColumnMeta): any {
    if (cc[1] !== null && cc[1].type !== undefined) {
      var tt = cc[1].type;
      if (tt == 'boolean') return { type: 'checkbox' };
      if (tt == 'integer') return { type: 'number' };
      if (tt == 'multiline') return { type: 'multiline' };
      if (tt == 'postal_address') return { type: 'postal_address' };
      if (tt == 'date') return { type: 'date' };
      if (tt == 'currency_usd') return { type: 'number' };
      if (tt == 'yenot_leadsource')
        return {
          type: 'dropdown',
          options: [{ key: 'Google', value: 'Google' }],
        };
      //if (tt == 'stringlist') return { formatter: listconcat };
      if (entityList.includes(tt)) {
        let a = tt.match(/^(yenot|yenot)_([a-z]+)/);
        return {
          type: 'entity-reference',
          params: { entity: a[2], plural: toPlural(a[2]) },
        };
      }
      if (tt.match(/^yenot_([a-z]+)\.surrogate/)) {
        let a = tt.match(/^yenot_([a-z]+)\.surrogate/);
        return {
          type: 'entity-lookup',
          params: { entity: a[1], plural: toPlural(a[1]) },
        };
      }
      if (tt.match(/^yenot_([a-z]+)\.surrogate/)) {
        let a = tt.match(/^yenot_([a-z]+)\.surrogate/);
        return {
          type: 'entity-lookup',
          params: { entity: a[1], plural: toPlural(a[1]) },
        };
      }
    }
    return {};
  }

  var grcol = columns.filter(isVisibleForm).map(function (cc) {
    var gt = gtype(cc);
    return {
      field: cc[0],
      label: autoTransformLabel(cc),
      type: gt.type,
      params: gt.params,
      options: gt.options,
    };
  });
  return grcol;
}
