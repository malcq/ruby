import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import { Link, withRouter } from 'react-router-dom';
import { stringify } from 'query-string';

import times from 'lodash/times';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import { PAGINATION } from 'constants';

/**
 * Renders maximum 3 pages at a time. Skipped pages are replaced by dots
 */
const renderPages = (totalPages, currentPage, urlPath) => (
  <Fragment>
    {currentPage >= 3 && (
      <PaginationItem disabled>
        <PaginationLink>...</PaginationLink>
      </PaginationItem>
    )}
    {times(3, index => {
      const page = (currentPage + index) - 1;

      // Ensure we don't render excessive pages
      if (page === 0 || page === totalPages + 1) {
        return null;
      }

      return (
        <PaginationItem
          key={page}
          active={currentPage === page}
        >
          <PaginationLink
            to={{ pathname: urlPath, search: page === 1 ? '' : stringify({ page }) }}
            tag={Link}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    })}
    {(totalPages - currentPage) >= 2 && (
      <PaginationItem disabled>
        <PaginationLink>...</PaginationLink>
      </PaginationItem>
    )}
  </Fragment>
);

const Paginator = ({ totalItems, currentPage, urlPath }) => {
  const totalPages = Math.ceil(totalItems / PAGINATION.LIMIT);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="d-flex" listClassName="ml-auto">
      <PaginationItem disabled={currentPage <= 1}>
        <PaginationLink
          previous
          to={{ pathname: urlPath, search: currentPage === 2 ? '' : stringify({ page: currentPage - 1 }) }}
          tag={Link}
        />
      </PaginationItem>
      {renderPages(totalPages, currentPage, urlPath)}
      <PaginationItem disabled={currentPage >= totalPages}>
        <PaginationLink
          next
          to={{ pathname: urlPath, search: stringify({ page: currentPage + 1 }) }}
          tag={Link}
        />
      </PaginationItem>
    </Pagination>
  );
};

Paginator.propTypes = {
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  urlPath: PropTypes.string.isRequired,
};

const mapStateToProps = (state, { location: { query } }) => ({
  currentPage: Number(query.page || 1),
});

export default compose(
  withRouter,
  connect(mapStateToProps),
)(Paginator);
