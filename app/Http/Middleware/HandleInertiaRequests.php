<?php

/**
 * HandleInertiaRequests.php
 * Copyright (c) 2019 james@firefly-iii.org
 *
 * This file is part of Firefly III (https://github.com/firefly-iii).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

declare(strict_types=1);

namespace FireflyIII\Http\Middleware;

use FireflyIII\Repositories\Currency\CurrencyRepositoryInterface;
use FireflyIII\Repositories\User\UserRepositoryInterface;
use FireflyIII\Support\Facades\Preferences;
use FireflyIII\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        /** @var User|null $user */
        $user = $request->user();

        return array_merge(parent::share($request), [
            // Authentication data
            'auth' => [
                'user' => $user ? $this->getUserData($user) : null,
                'check' => auth()->check(),
            ],

            // Flash messages with all Firefly III message types
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],

            // Application configuration
            'app' => [
                'name' => config('app.name'),
                'version' => config('firefly.version'),
                'url' => config('app.url'),
                'locale' => app()->getLocale(),
                'timezone' => config('app.timezone'),
                'demo' => config('firefly.is_demo_site', false),
            ],

            // User preferences (only if authenticated)
            'preferences' => $user ? $this->getUserPreferences($user) : null,

            // Available options for dropdowns and forms
            'options' => [
                'languages' => config('firefly.languages', []),
                'darkModes' => config('firefly.available_dark_modes', ['light', 'dark', 'browser']),
                'viewRanges' => config('firefly.valid_view_ranges', ['1D', '1W', '1M', '3M', '6M', '1Y']),
            ],

            // Primary currency information (only if authenticated)
            'currency' => $user ? $this->getPrimaryCurrency($user) : null,
        ]);
    }

    /**
     * Get user data for sharing with frontend
     */
    private function getUserData(User $user): array
    {
        /** @var UserRepositoryInterface $userRepository */
        $userRepository = app(UserRepositoryInterface::class);

        return [
            'id' => $user->id,
            'email' => $user->email,
            'blocked' => $user->blocked,
            'user_group_id' => $user->user_group_id,
            'roles' => $user->roles->pluck('name')->toArray(),
            'is_admin' => $userRepository->hasRole($user, 'owner'),
            'is_demo' => $userRepository->hasRole($user, 'demo'),
            'created_at' => $user->created_at?->toISOString(),
            'updated_at' => $user->updated_at?->toISOString(),
        ];
    }

    /**
     * Get user preferences for sharing with frontend
     */
    private function getUserPreferences(User $user): array
    {
        return [
            'language' => Preferences::getForUser($user, 'language', config('firefly.default_language', 'en_US'))->data,
            'locale' => Preferences::getForUser($user, 'locale', config('firefly.default_locale', 'equal'))->data,
            'listPageSize' => (int) Preferences::getForUser($user, 'listPageSize', 50)->data,
            'darkMode' => Preferences::getForUser($user, 'darkMode', 'browser')->data,
            'customFiscalYear' => (bool) Preferences::getForUser($user, 'customFiscalYear', false)->data,
            'fiscalYearStart' => Preferences::getForUser($user, 'fiscalYearStart', '01-01')->data,
            'convertToPrimary' => (bool) Preferences::getForUser($user, 'convertToPrimary', false)->data,
            'frontpageAccounts' => Preferences::getForUser($user, 'frontpageAccounts', [])->data,
            'transactionJournalOptionalFields' => Preferences::getForUser($user, 'transaction_journal_optional_fields', [])->data,
            'viewRange' => Preferences::getForUser($user, 'viewRange', '1M')->data,
        ];
    }

    /**
     * Get primary currency information for the user
     */
    private function getPrimaryCurrency(User $user): ?array
    {
        try {
            /** @var CurrencyRepositoryInterface $currencyRepository */
            $currencyRepository = app(CurrencyRepositoryInterface::class);
            $currency = $currencyRepository->getPrimary();

            if (null === $currency) {
                return null;
            }

            return [
                'id' => $currency->id,
                'name' => $currency->name,
                'code' => $currency->code,
                'symbol' => $currency->symbol,
                'decimal_places' => $currency->decimal_places,
            ];
        } catch (\Exception $e) {
            // Log error but don't break the request
            app('log')->error('Error getting primary currency in Inertia middleware: ' . $e->getMessage());
            return null;
        }
    }
}
