import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tool-icon-span',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: ` <fa-icon [icon]="faIcon"></fa-icon> `,
  styleUrls: ['./icon-span.component.css'],
})
export class IconSpanComponent implements OnChanges {
  @Input() name?: string;

  faIcon: any = null;

  iconMap: any = {
    hamburger: fas['faBars'],
    'action-menu': fas['faEllipsisV'],
    'edit-pencil': fas['faPenToSquare'],
    'send-person': fas['faUserCheck'],
    'add-person': fas['faUserPlus'],
    refresh: fas['faRefresh'],
    add: fas['faCirclePlus'],
    delete: fas['faTrashCan'],
    copy: fas['faClipboard'],
    'primary-marker': fas['faStar'],
    'arrow-down': fas['faArrowDown'],
    'arrow-up': fas['faArrowUp'],
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['name'] && changes['name'].currentValue) {
      this.faIcon = this.iconMap[changes['name'].currentValue] ?? null;
    }
  }
}
