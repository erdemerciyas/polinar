import * as migration_20260327_142417_add_page_globals from './20260327_142417_add_page_globals';
import * as migration_20260328_120000_expand_about_page from './20260328_120000_expand_about_page';
import * as migration_20260330_000000_slider_settings_upgrade from './20260330_000000_slider_settings_upgrade';

export const migrations = [
  {
    up: migration_20260327_142417_add_page_globals.up,
    down: migration_20260327_142417_add_page_globals.down,
    name: '20260327_142417_add_page_globals'
  },
  {
    up: migration_20260328_120000_expand_about_page.up,
    down: migration_20260328_120000_expand_about_page.down,
    name: '20260328_120000_expand_about_page'
  },
  {
    up: migration_20260330_000000_slider_settings_upgrade.up,
    down: migration_20260330_000000_slider_settings_upgrade.down,
    name: '20260330_000000_slider_settings_upgrade'
  },
];
